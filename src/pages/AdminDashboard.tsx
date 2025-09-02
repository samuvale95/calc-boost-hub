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
  Settings,
  Brain,
  CheckCircle,
  XCircle,
  Play
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

// Quiz mockup
const mockQuiz = [
  {
    id: "1",
    question: "Quale è la frequenza cardiaca normale a riposo per un adulto sano?",
    options: [
      { id: "a", text: "40-50 bpm", isCorrect: false },
      { id: "b", text: "60-100 bpm", isCorrect: true },
      { id: "c", text: "100-120 bpm", isCorrect: false },
      { id: "d", text: "120-140 bpm", isCorrect: false }
    ]
  },
  {
    id: "2", 
    question: "Qual è il primo intervento da fare in caso di arresto cardiaco?",
    options: [
      { id: "a", text: "Chiamare il medico", isCorrect: false },
      { id: "b", text: "Iniziare la RCP (rianimazione cardiopolmonare)", isCorrect: true },
      { id: "c", text: "Somministrare farmaci", isCorrect: false },
      { id: "d", text: "Portare il paziente in ospedale", isCorrect: false }
    ]
  },
  {
    id: "3",
    question: "A quale temperatura corporea si considera febbre alta in un adulto?",
    options: [
      { id: "a", text: "37.5°C", isCorrect: false },
      { id: "b", text: "38.0°C", isCorrect: false },
      { id: "c", text: "38.5°C", isCorrect: false },
      { id: "d", text: "39.0°C o superiore", isCorrect: true }
    ]
  },
  {
    id: "4",
    question: "Quale di questi è un segno di disidratazione grave?",
    options: [
      { id: "a", text: "Sete leggera", isCorrect: false },
      { id: "b", text: "Pelle secca e mucose asciutte", isCorrect: true },
      { id: "c", text: "Sudorazione eccessiva", isCorrect: false },
      { id: "d", text: "Aumento dell'appetito", isCorrect: false }
    ]
  },
  {
    id: "5",
    question: "Qual è la posizione corretta per un paziente incosciente che respira?",
    options: [
      { id: "a", text: "Supina (a pancia in su)", isCorrect: false },
      { id: "b", text: "Prona (a pancia in giù)", isCorrect: false },
      { id: "c", text: "Posizione laterale di sicurezza", isCorrect: true },
      { id: "d", text: "Seduta", isCorrect: false }
    ]
  },
  {
    id: "6",
    question: "Quale parametro vitale viene misurato con lo sfigmomanometro?",
    options: [
      { id: "a", text: "Temperatura corporea", isCorrect: false },
      { id: "b", text: "Frequenza cardiaca", isCorrect: false },
      { id: "c", text: "Pressione arteriosa", isCorrect: true },
      { id: "d", text: "Frequenza respiratoria", isCorrect: false }
    ]
  }
];

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string}>({});
  const [quizResults, setQuizResults] = useState<{[key: string]: boolean}>({});
  const [showResults, setShowResults] = useState(false);
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

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmitQuiz = () => {
    const results: {[key: string]: boolean} = {};
    
    mockQuiz.forEach(question => {
      const selectedAnswer = selectedAnswers[question.id];
      const correctAnswer = question.options.find(opt => opt.isCorrect);
      results[question.id] = selectedAnswer === correctAnswer?.id;
    });
    
    setQuizResults(results);
    setShowResults(true);
    
    const correctCount = Object.values(results).filter(Boolean).length;
    toast({
      title: "Quiz Completato",
      description: `Hai risposto correttamente a ${correctCount} domande su ${mockQuiz.length}`
    });
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setQuizResults({});
    setShowResults(false);
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
        <Card className="mb-8">
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

        {/* Quiz Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Quiz di Formazione Medica
            </CardTitle>
            <p className="text-muted-foreground">
              Test le tue conoscenze mediche con questo quiz di 6 domande
            </p>
          </CardHeader>
          <CardContent>
            {!showResults ? (
              <div className="space-y-6">
                {mockQuiz.map((question, index) => (
                  <Card key={question.id} className="p-4">
                    <h3 className="font-semibold mb-4 text-lg">
                      {index + 1}. {question.question}
                    </h3>
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option.id}
                            checked={selectedAnswers[question.id] === option.id}
                            onChange={() => handleAnswerSelect(question.id, option.id)}
                            className="text-primary focus:ring-primary"
                          />
                          <span className="text-sm">{option.text}</span>
                        </label>
                      ))}
                    </div>
                  </Card>
                ))}
                <div className="flex gap-4 pt-4">
                  <Button 
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length !== mockQuiz.length}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Invia Risposte
                  </Button>
                  <Button variant="outline" onClick={resetQuiz}>
                    Reset Quiz
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center p-6 bg-accent/20 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Risultati del Quiz</h3>
                  <p className="text-lg">
                    Hai risposto correttamente a{" "}
                    <span className="font-bold text-primary">
                      {Object.values(quizResults).filter(Boolean).length}
                    </span>{" "}
                    domande su {mockQuiz.length}
                  </p>
                </div>
                
                {mockQuiz.map((question, index) => (
                  <Card key={question.id} className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      {quizResults[question.id] ? (
                        <CheckCircle className="h-5 w-5 text-accent mt-1" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive mt-1" />
                      )}
                      <h3 className="font-semibold text-lg">
                        {index + 1}. {question.question}
                      </h3>
                    </div>
                    
                    <div className="space-y-2 ml-8">
                      {question.options.map((option) => {
                        const isSelected = selectedAnswers[question.id] === option.id;
                        const isCorrect = option.isCorrect;
                        
                        return (
                          <div
                            key={option.id}
                            className={`p-3 rounded-lg border ${
                              isCorrect 
                                ? 'bg-accent/20 border-accent text-accent-foreground' 
                                : isSelected 
                                ? 'bg-destructive/20 border-destructive'
                                : 'bg-background'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrect && <CheckCircle className="h-4 w-4 text-accent" />}
                              {isSelected && !isCorrect && <XCircle className="h-4 w-4 text-destructive" />}
                              <span className="text-sm">{option.text}</span>
                              {isCorrect && <Badge className="ml-auto">Corretta</Badge>}
                              {isSelected && !isCorrect && <Badge variant="destructive" className="ml-auto">Tua risposta</Badge>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                ))}
                
                <Button onClick={resetQuiz} className="w-full">
                  Riprova il Quiz
                </Button>
              </div>
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