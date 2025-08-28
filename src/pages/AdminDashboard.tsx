import { useState } from "react";
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
  Mail, 
  Calendar,
  UserPlus,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Dati mockup
const mockUsers = [
  {
    id: "1",
    name: "Mario Rossi",
    email: "mario.rossi@email.com",
    subscription: "annuale",
    status: "attivo",
    registrationDate: "2024-01-15",
    lastLogin: "2024-08-20"
  },
  {
    id: "2", 
    name: "Giulia Bianchi",
    email: "giulia.bianchi@email.com",
    subscription: "pdf",
    status: "attivo",
    registrationDate: "2024-02-22",
    lastLogin: "2024-08-22"
  },
  {
    id: "3",
    name: "Luca Verde",
    email: "luca.verde@email.com", 
    subscription: "annuale",
    status: "scaduto",
    registrationDate: "2023-08-10",
    lastLogin: "2024-07-15"
  },
  {
    id: "4",
    name: "Anna Neri",
    email: "anna.neri@email.com",
    subscription: "annuale", 
    status: "attivo",
    registrationDate: "2024-03-05",
    lastLogin: "2024-08-25"
  }
];

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    subscription: ""
  });
  const { toast } = useToast();

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGeneratePassword = (userId: string, userName: string) => {
    // Mockup - sarà implementato con Supabase
    toast({
      title: "Password Generata",
      description: `Nuova password generata per ${userName}`
    });
  };

  const handleSendEmail = (userId: string, userEmail: string) => {
    // Mockup - sarà implementato con Supabase
    toast({
      title: "Email Inviata", 
      description: `Credenziali inviate a ${userEmail}`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "attivo":
        return <Badge className="bg-accent text-accent-foreground">Attivo</Badge>;
      case "scaduto":
        return <Badge variant="destructive">Scaduto</Badge>;
      default:
        return <Badge variant="secondary">Sconosciuto</Badge>;
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

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.subscription) {
      toast({
        title: "Errore",
        description: "Tutti i campi sono obbligatori",
        variant: "destructive"
      });
      return;
    }

    const user = {
      id: String(users.length + 1),
      name: newUser.name,
      email: newUser.email,
      subscription: newUser.subscription,
      status: "attivo",
      registrationDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev, user]);
    setNewUser({ name: "", email: "", password: "", subscription: "" });
    setIsModalOpen(false);
    
    toast({
      title: "Utente Aggiunto",
      description: `${user.name} è stato aggiunto con successo`
    });
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
            <Button 
              variant="accent" 
              className="flex items-center gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <UserPlus className="h-5 w-5" />
              Nuovo Utente
            </Button>
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
                  {users.filter(u => u.status === "attivo").length}
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
        <Card>
          <CardHeader>
            <CardTitle>Lista Utenti ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Abbonamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registrazione</TableHead>
                  <TableHead>Ultimo Accesso</TableHead>
                  <TableHead>Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      {getSubscriptionBadge(user.subscription)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
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
                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSendEmail(user.id, user.email)}
                          className="flex items-center gap-1"
                        >
                          <Mail className="h-4 w-4" />
                          Email
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Annulla
              </Button>
              <Button onClick={handleAddUser}>
                Aggiungi Utente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;