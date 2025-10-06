import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Search, 
  Key, 
  Calendar,
  UserPlus,
  Settings,
  Brain,
  Loader2,
  RefreshCw,
  UserX,
  UserCheck,
  Edit
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/useApi";
import { API_CONFIG } from "@/config/api";

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  subscription: string;
  isActive: boolean;
  subscriptionExpiry: string | null;
  registrationDate: string;
  lastLogin: string;
}

// API Response interface
interface ApiUser {
  id: number;
  name: string;
  email: string;
  subscription: string;
  role: string;
  registration_date: string;
  last_access: string | null;
  is_active: boolean;
  subscription_expiry_date: string | null;
  created_at: string;
  updated_at: string;
}

// Mock data removed - using empty list on error instead

// Quiz mockup - removed (moved to Quiz.tsx)

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    subscription: ""
  });
  const [editExpiryModal, setEditExpiryModal] = useState({
    isOpen: false,
    userId: "",
    userName: "",
    currentExpiry: "",
    isUpdating: false
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const api = useApi();

  // Fetch users from API
  useEffect(() => {
    // Prevent multiple simultaneous calls
    if (hasLoaded) return;
    
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await api.getUsers();
        
        // Transform API data to match our User interface
        const transformedUsers: User[] = data.users.map((user: ApiUser) => ({
          id: String(user.id),
          name: user.name,
          email: user.email,
          subscription: user.subscription,
          isActive: user.is_active,
          subscriptionExpiry: user.subscription_expiry_date,
          registrationDate: user.registration_date.split('T')[0], // Extract date part
          lastLogin: user.last_access ? user.last_access.split('T')[0] : new Date().toISOString().split('T')[0]
        }));
        
        setUsers(transformedUsers);
        setHasLoaded(true);
        
        toast({
          title: "Utenti Caricati",
          description: `${transformedUsers.length} utenti caricati con successo`
        });
        
      } catch (err) {
        console.error('Errore nel caricamento degli utenti:', err);
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
        
        // Leave users list empty on error
        setUsers([]);
        setHasLoaded(true); // Mark as loaded even on error to prevent retries
        
        toast({
          title: "Errore di Connessione",
          description: "Impossibile caricare gli utenti. La lista rimane vuota.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [hasLoaded, api, toast]); // Add dependencies back but with hasLoaded guard

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGeneratePassword = async (userId: string, userName: string) => {
    // Show confirmation toast first
    toast({
      title: "Conferma Rigenerazione Password",
      description: `Sei sicuro di voler rigenerare la password per ${userName}?`,
      action: (
        <Button
          variant="destructive"
          size="sm"
          onClick={async () => {
            try {
              await regeneratePassword(userId);
              toast({
                title: "Password Rigenerata",
                description: `Nuova password generata e inviata per ${userName}`
              });
            } catch (err) {
              toast({
                title: "Errore",
                description: err instanceof Error ? err.message : "Impossibile rigenerare la password",
                variant: "destructive"
              });
            }
          }}
        >
          Conferma
        </Button>
      ),
    });
  };

  const handleDeactivateUser = async (userId: string, userName: string, userIsActive: boolean) => {
    // Don't allow deactivating already inactive users
    if (!userIsActive) {
      toast({
        title: "Utente già disattivato",
        description: `${userName} è già disattivato`,
        variant: "destructive"
      });
      return;
    }

    // Show confirmation toast
    toast({
      title: "Conferma Disattivazione Utente",
      description: `Sei sicuro di voler disattivare ${userName}? L'utente non potrà più accedere alla piattaforma.`,
      action: (
        <Button
          variant="destructive"
          size="sm"
          onClick={async () => {
            try {
              await deactivateUser(userId);
              
              // Update local state to reflect the change
              setUsers(prev => prev.map(user => 
                user.id === userId 
                  ? { ...user, isActive: false }
                  : user
              ));
              
              toast({
                title: "Utente Disattivato",
                description: `${userName} è stato disattivato con successo`
              });
            } catch (err) {
              toast({
                title: "Errore",
                description: err instanceof Error ? err.message : "Impossibile disattivare l'utente",
                variant: "destructive"
              });
            }
          }}
        >
          Disattiva
        </Button>
      ),
    });
  };

  const handleReactivateUser = async (userId: string, userName: string, userIsActive: boolean) => {
    // Don't allow reactivating already active users
    if (userIsActive) {
      toast({
        title: "Utente già attivo",
        description: `${userName} è già attivo`,
        variant: "destructive"
      });
      return;
    }

    // Show confirmation toast
    toast({
      title: "Conferma Riattivazione Utente",
      description: `Sei sicuro di voler riattivare ${userName}? L'utente potrà nuovamente accedere alla piattaforma.`,
      action: (
        <Button
          variant="default"
          size="sm"
          onClick={async () => {
            try {
              await reactivateUser(userId);
              
              // Update local state to reflect the change
              setUsers(prev => prev.map(user => 
                user.id === userId 
                  ? { ...user, isActive: true }
                  : user
              ));
              
              toast({
                title: "Utente Riattivato",
                description: `${userName} è stato riattivato con successo`
              });
            } catch (err) {
              toast({
                title: "Errore",
                description: err instanceof Error ? err.message : "Impossibile riattivare l'utente",
                variant: "destructive"
              });
            }
          }}
        >
          Riattiva
        </Button>
      ),
    });
  };



  const getStatusBadge = (user: User) => {
    const now = new Date();
    const expiryDate = user.subscriptionExpiry ? new Date(user.subscriptionExpiry) : null;
    const isSubscriptionActive = expiryDate ? expiryDate > now : false;
    
    if (!user.isActive || !isSubscriptionActive) {
      return <Badge variant="destructive">Scaduto</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">Attivo</Badge>;
    }
  };

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case "annuale":
        return <Badge className="bg-primary text-primary-foreground">Annuale</Badge>;
      case "pdf":
        return <Badge variant="outline">PDF</Badge>;
      default:
        return <Badge variant="secondary">Altro</Badge>;
    }
  };

  const handleEditExpiryDate = (userId: string, userName: string, currentExpiry: string | null) => {
    setEditExpiryModal({
      isOpen: true,
      userId,
      userName,
      currentExpiry: currentExpiry || ""
    });
  };

  const handleUpdateExpiryDate = async () => {
    try {
      const newExpiryDate = editExpiryModal.currentExpiry;
      
      if (!newExpiryDate) {
        toast({
          title: "Errore",
          description: "Inserisci una data di scadenza valida",
          variant: "destructive",
        });
        return;
      }

      setEditExpiryModal(prev => ({ ...prev, isUpdating: true }));

      // Format the date to ISO string with timezone
      const formattedDate = new Date(newExpiryDate + 'T23:59:59Z').toISOString();
      
      // Call API to update user
      const endpoint = API_CONFIG.ENDPOINTS.UPDATE_USER.replace('{id}', editExpiryModal.userId);
      const response = await api.apiService.request(endpoint, {
        method: 'PUT',
        body: JSON.stringify({
          subscription_expiry_date: formattedDate
        }),
      });
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === editExpiryModal.userId 
          ? { ...user, subscriptionExpiry: newExpiryDate }
          : user
      ));
      
      toast({
        title: "Data di Scadenza Aggiornata",
        description: `La data di scadenza per ${editExpiryModal.userName} è stata aggiornata`,
      });
      
      setEditExpiryModal({ isOpen: false, userId: "", userName: "", currentExpiry: "", isUpdating: false });
    } catch (error) {
      console.error('Error updating expiry date:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare la data di scadenza",
        variant: "destructive",
      });
      setEditExpiryModal(prev => ({ ...prev, isUpdating: false }));
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.subscription) {
      toast({
        title: "Errore",
        description: "Tutti i campi sono obbligatori",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const registeredUser = await registerUser(newUser);
      
      // Add the new user to the local state
      setUsers(prev => [...prev, registeredUser]);
      
      // Reset form and close modal
      setNewUser({ name: "", email: "", password: "", subscription: "" });
      setIsModalOpen(false);
      
      toast({
        title: "Utente Aggiunto",
        description: `${registeredUser.name} è stato registrato con successo`
      });
      
    } catch (err) {
      console.error('Errore nella registrazione:', err);
      
      toast({
        title: "Errore di Registrazione",
        description: err instanceof Error ? err.message : "Impossibile registrare l'utente",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setHasLoaded(false); // Reset the flag to allow refresh
      
      const data = await api.getUsers();
      
      const transformedUsers: User[] = data.users.map((user: ApiUser) => ({
        id: String(user.id),
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        status: user.is_active ? 'attivo' : 'scaduto',
        registrationDate: user.registration_date.split('T')[0], // Extract date part
        lastLogin: user.last_access ? user.last_access.split('T')[0] : new Date().toISOString().split('T')[0]
      }));
      
      setUsers(transformedUsers);
      setHasLoaded(true);
      
      toast({
        title: "Utenti Aggiornati",
        description: `${transformedUsers.length} utenti caricati con successo`
      });
      
    } catch (err) {
      console.error('Errore nel refresh degli utenti:', err);
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      
      // Leave users list empty on error
      setUsers([]);
      setHasLoaded(true);
      
      toast({
        title: "Errore di Connessione",
        description: "Impossibile aggiornare gli utenti. La lista rimane vuota.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (userData: {
    name: string;
    email: string;
    password: string;
    subscription: string;
  }) => {
    try {
      // Register doesn't require authentication, so we use the direct API service
      const newUserData: ApiUser = await api.apiService.request(API_CONFIG.ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          subscription: userData.subscription,
        }),
      });
      
      // Transform the API response to match our User interface
      const transformedUser: User = {
        id: String(newUserData.id),
        name: newUserData.name,
        email: newUserData.email,
        subscription: newUserData.subscription,
        isActive: newUserData.is_active,
        subscriptionExpiry: newUserData.subscription_expiry_date,
        registrationDate: newUserData.registration_date ? newUserData.registration_date.split('T')[0] : new Date().toISOString().split('T')[0],
        lastLogin: newUserData.last_access ? newUserData.last_access.split('T')[0] : new Date().toISOString().split('T')[0]
      };

      return transformedUser;
    } catch (err) {
      console.error('Errore nella registrazione utente:', err);
      throw err;
    }
  };

  const regeneratePassword = async (userId: string) => {
    try {
      const result = await api.regeneratePassword(parseInt(userId));
      return result;
    } catch (err) {
      console.error('Errore nella rigenerazione password:', err);
      throw err;
    }
  };

  const deactivateUser = async (userId: string) => {
    try {
      const result = await api.deactivateUser(parseInt(userId));
      return result;
    } catch (err) {
      console.error('Errore nella disattivazione utente:', err);
      throw err;
    }
  };

  const reactivateUser = async (userId: string) => {
    try {
      const result = await api.activateUser(parseInt(userId));
      return result;
    } catch (err) {
      console.error('Errore nella riattivazione utente:', err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Users className="h-10 w-10 text-primary" />
                Gestione Utenti
              </h1>
              <p className="text-muted-foreground text-lg">
                Amministra gli utenti della piattaforma
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleRefreshUsers}
                disabled={isLoading}
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                Aggiorna
              </Button>
              <Button 
                variant="accent" 
                className="flex items-center gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                <UserPlus className="h-5 w-5" />
                Nuovo Utente
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Totale Utenti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Abbonati Annuali
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {users.filter(u => u.subscription === "annuale").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Acquisti PDF
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">
                  {users.filter(u => u.subscription === "pdf").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Utenti Attivi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">
                  {users.filter(u => u.isActive).length}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Ricerca Utenti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Cerca per nome o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Filtri
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Lista Utenti ({filteredUsers.length})
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                ⚠️ Errore: {error}
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Caricamento utenti...</span>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Abbonamento</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead>Scadenza</TableHead>
                    <TableHead>Registrazione</TableHead>
                    <TableHead>Ultimo Accesso</TableHead>
                    <TableHead>Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {error ? 'Errore nel caricamento degli utenti' : 
                         searchTerm ? 'Nessun utente trovato per la ricerca' : 
                         'Nessun utente disponibile'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          {getSubscriptionBadge(user.subscription)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(user)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {user.subscriptionExpiry 
                                ? new Date(user.subscriptionExpiry).toLocaleDateString('it-IT')
                                : 'N/A'
                              }
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleEditExpiryDate(user.id, user.name, user.subscriptionExpiry)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(user.registrationDate).toLocaleDateString('it-IT')}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(user.lastLogin).toLocaleDateString('it-IT')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGeneratePassword(user.id, user.name)}
                              className="flex items-center gap-1"
                            >
                              <Key className="h-4 w-4" />
                              Password
                            </Button>
                            {user.isActive ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeactivateUser(user.id, user.name, user.isActive)}
                                className="flex items-center gap-1"
                              >
                                <UserX className="h-4 w-4" />
                                Disattiva
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReactivateUser(user.id, user.name, user.isActive)}
                                className="flex items-center gap-1"
                              >
                                <UserCheck className="h-4 w-4" />
                                Riattiva
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Modal for adding new user */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Aggiungi Nuovo Utente
              </DialogTitle>
              <DialogDescription>
                Inserisci i dati del nuovo utente. L'accesso verrà creato senza richiesta di pagamento.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                  placeholder="Nome completo"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="col-span-3"
                  placeholder="email@esempio.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  className="col-span-3"
                  placeholder="Password temporanea"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subscription" className="text-right">
                  Abbonamento
                </Label>
                <Select
                  value={newUser.subscription}
                  onValueChange={(value) => setNewUser(prev => ({ ...prev, subscription: value }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleziona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annuale">Abbonamento Annuale</SelectItem>
                    <SelectItem value="pdf">Acquisto PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isLoading}>
                Annulla
              </Button>
              <Button onClick={handleAddUser} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Registrazione...
                  </>
                ) : (
                  "Aggiungi Utente"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Expiry Date Modal */}
        <Dialog open={editExpiryModal.isOpen} onOpenChange={(open) => setEditExpiryModal(prev => ({ ...prev, isOpen: open }))}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifica Data di Scadenza</DialogTitle>
              <DialogDescription>
                Aggiorna la data di scadenza per {editExpiryModal.userName}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expiry-date" className="text-right">
                  Data Scadenza
                </Label>
                <Input
                  id="expiry-date"
                  type="date"
                  value={editExpiryModal.currentExpiry}
                  onChange={(e) => setEditExpiryModal(prev => ({ ...prev, currentExpiry: e.target.value }))}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setEditExpiryModal({ isOpen: false, userId: "", userName: "", currentExpiry: "", isUpdating: false })}
                disabled={editExpiryModal.isUpdating}
              >
                Annulla
              </Button>
              <Button 
                onClick={handleUpdateExpiryDate}
                disabled={editExpiryModal.isUpdating}
              >
                {editExpiryModal.isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Aggiornamento...
                  </>
                ) : (
                  "Salva"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;