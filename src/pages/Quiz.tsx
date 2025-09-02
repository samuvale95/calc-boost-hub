import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, CheckCircle, XCircle, Play, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import quizJson from "../data/DAND_qt_NO_sonno.json";
import { v4 as uuidv4 } from "uuid";

// Quiz mockup
const quiz = quizJson.questions.map(question => ({
  id: uuidv4(),
  ...question,
  response: question.response.map((option: { text: string; points: number }, idx: number) => ({
    id: uuidv4(),
    ...option
  }))
}));

const Quiz = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string}>({});
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
    setShowResults(true);
    toast({
      title: "Quiz Completato!",
      description: "Hai completato con successo il test di formazione medica.",
    });
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
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

        <Card>
          <CardContent className="p-6">
            {!showResults ? (
              <div className="space-y-6">
                {quiz.map((question, index) => (
                  <Card key={question.id} className="p-4">
                    <h3 className="font-semibold mb-4 text-lg">
                      {index + 1}. {question.text}
                    </h3>
                    <div className="space-y-2">
                      {question.response.map((option) => (
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
                    disabled={Object.keys(selectedAnswers).length !== quiz.length}
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
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Quiz Completato!</h2>
                  <p className="text-muted-foreground text-lg">
                    Hai completato con successo il test di formazione medica.
                  </p>
                </div>
                
                <div className="flex gap-4 pt-4 justify-center">
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