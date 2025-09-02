import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, CheckCircle, XCircle, Play, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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

const Quiz = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string}>({});
  const [quizResults, setQuizResults] = useState<{[key: string]: boolean}>({});
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Brain className="h-10 w-10 text-primary" />
                Quiz di Formazione Medica
              </h1>
              <p className="text-muted-foreground text-lg">
                Test le tue conoscenze mediche con questo quiz di 6 domande
              </p>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate("/admin")}
            >
              <Home className="h-5 w-5" />
              Torna al Dashboard
            </Button>
          </div>
        </div>

        {/* Quiz Content */}
        <Card>
          <CardContent className="p-6">
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
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                      )}
                      <h3 className="font-semibold text-lg">
                        {index + 1}. {question.question}
                      </h3>
                    </div>
                    
                    <div className="space-y-2 ml-8">
                      {question.options.map((option) => {
                        const isSelected = selectedAnswers[question.id] === option.id;
                        const isCorrect = option.isCorrect;
                        
                        let optionClass = "p-3 rounded-lg border ";
                        if (isCorrect) {
                          optionClass += "bg-green-50 border-green-200 text-green-800";
                        } else if (isSelected && !isCorrect) {
                          optionClass += "bg-red-50 border-red-200 text-red-800";
                        } else {
                          optionClass += "bg-gray-50 border-gray-200";
                        }
                        
                        return (
                          <div key={option.id} className={optionClass}>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium">
                                {option.id.toUpperCase()})
                              </span>
                              <span className="text-sm">{option.text}</span>
                              {isCorrect && (
                                <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                              )}
                              {isSelected && !isCorrect && (
                                <XCircle className="h-4 w-4 text-red-500 ml-auto" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                ))}
                
                <div className="flex gap-4 pt-4">
                  <Button onClick={resetQuiz} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Rifai il Quiz
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/admin")}
                    className="flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Torna al Dashboard
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;