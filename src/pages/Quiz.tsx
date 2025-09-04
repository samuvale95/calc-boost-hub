import { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Brain, CheckCircle, XCircle, Play, Home, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import quizJson from "../data/DAND_qt.json";
import { v4 as uuidv4 } from "uuid";

// Quiz mockup
const quiz = quizJson.questions.map(question => ({
  id: uuidv4(),
  ...question,
  response: question.response.map((option: { text: string; score: number }, idx: number) => ({
    id: uuidv4(),
    ...option
  }))
}));

const Quiz = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isUserAdmin } = useAdmin();
  const stepperRef = useRef<HTMLDivElement>(null);

  // Group questions by section
  const sections = useMemo(() => {
    const sectionMap = new Map();
    quiz.forEach(question => {
      if (!sectionMap.has(question.section)) {
        sectionMap.set(question.section, []);
      }
      sectionMap.get(question.section).push(question);
    });
    return Array.from(sectionMap.entries()).map(([name, questions]) => ({
      name,
      questions,
      id: uuidv4()
    }));
  }, []);

  const currentSection = sections[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];
  const totalQuestions = sections.reduce((total, section) => total + section.questions.length, 0);
  const answeredQuestions = Object.keys(selectedAnswers).filter(key => 
    selectedAnswers[key] !== undefined && selectedAnswers[key] !== ""
  ).length;

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSliderChange = (questionId: string, value: number[]) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: value[0].toString()
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      setCurrentQuestionIndex(sections[currentSectionIndex - 1].questions.length - 1);
    }
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
    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout effettuato",
      description: "Sei stato disconnesso con successo",
    });
    navigate("/login");
  };

  const isCurrentQuestionAnswered = currentQuestion ? 
    (currentQuestion.type === "closed-numeric" ? 
      selectedAnswers[currentQuestion.id] !== undefined && selectedAnswers[currentQuestion.id] !== "" :
      selectedAnswers[currentQuestion.id]) : false;
  const isLastQuestion = currentSectionIndex === sections.length - 1 && 
                        currentQuestionIndex === currentSection.questions.length - 1;

  // Auto-scroll to current section
  useEffect(() => {
    if (stepperRef.current) {
      const currentStep = stepperRef.current.children[0].children[currentSectionIndex] as HTMLElement;
      if (currentStep) {
        currentStep.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [currentSectionIndex]);

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
                Test le tue conoscenze mediche con questo quiz di {totalQuestions} domande
              </p>
              {user && (
                <div className="text-sm text-muted-foreground mt-1">
                  <p>Benvenuto, <span className="font-medium text-foreground">{user.name}</span>
                    {user.role === 'admin' && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        👑 Admin
                      </span>
                    )}
                  </p>
                  <p className="text-xs">Abbonamento: <span className="font-medium text-primary">{user.subscription}</span> • Status: <span className="font-medium text-green-600">{user.status}</span></p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {isUserAdmin() && (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => navigate("/admin")}
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Button>
              )}
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
          
          {/* Progress and Section Info */}
          {!showResults && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">
                  Domanda {answeredQuestions + 1} di {totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">
                  Sezione {currentSectionIndex + 1} di {sections.length}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
                ></div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-primary">
                  {currentSection?.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Domanda {currentQuestionIndex + 1} di {currentSection?.questions.length} in questa sezione
                </p>
              </div>
              
              {/* Section Stepper */}
              <div className="mt-6">
                <div className="relative py-2">
                  {/* Stepper Container with Horizontal Scroll */}
                  <div ref={stepperRef} className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 py-4 pb-2">
                    <div className="flex gap-8 min-w-max px-6">
                      {sections.map((section, index) => {
                        const sectionAnsweredQuestions = section.questions.filter(q => 
                      selectedAnswers[q.id] !== undefined && selectedAnswers[q.id] !== ""
                    ).length;
                        const isCurrentSection = index === currentSectionIndex;
                        const isCompleted = sectionAnsweredQuestions === section.questions.length;
                        const isStarted = sectionAnsweredQuestions > 0;
                        const isAccessible = index === 0 || sections[index - 1].questions.every(q => 
                          selectedAnswers[q.id] !== undefined && selectedAnswers[q.id] !== ""
                        );
                        
                        return (
                          <div key={section.id} className="flex flex-col items-center relative flex-shrink-0">
                            {/* Step Circle */}
                            <button
                              onClick={() => {
                                if (isAccessible) {
                                  setCurrentSectionIndex(index);
                                  setCurrentQuestionIndex(0);
                                }
                              }}
                              disabled={!isAccessible}
                              className={`relative z-10 w-14 h-14 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                                isCurrentSection
                                  ? 'bg-primary border-primary text-primary-foreground shadow-lg scale-110'
                                  : isCompleted
                                  ? 'bg-green-500 border-green-500 text-white hover:bg-green-600 hover:scale-105'
                                  : isStarted
                                  ? 'bg-yellow-500 border-yellow-500 text-white hover:bg-yellow-600 hover:scale-105'
                                  : isAccessible
                                  ? 'bg-white border-gray-300 text-gray-500 hover:border-primary hover:text-primary hover:scale-105'
                                  : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="w-6 h-6" />
                              ) : (
                                <span className="text-base">{index + 1}</span>
                              )}
                            </button>
                            
                            {/* Step Label */}
                            <div className="mt-3 text-center w-32" title={section.name}>
                              <div className={`text-sm font-medium leading-tight ${
                                isCurrentSection 
                                  ? 'text-primary' 
                                  : isCompleted 
                                  ? 'text-green-600' 
                                  : isStarted 
                                  ? 'text-yellow-600' 
                                  : isAccessible 
                                  ? 'text-gray-600' 
                                  : 'text-gray-400'
                              }`}>
                                {section.name}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 font-medium">
                                {sectionAnsweredQuestions}/{section.questions.length} domande
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Scroll Indicator */}
                  <div className="flex justify-center mt-2">
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <span>←</span>
                      <span>Scorri per vedere tutte le sezioni</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Card>
          <CardContent className="p-6">
            {!showResults ? (
              <div className="space-y-6">
                {currentQuestion && (
                  <Card className="p-6">
                    <h3 className="font-semibold mb-6 text-xl">
                      {currentQuestion.text}
                    </h3>
                    
                    {currentQuestion.type === "closed-numeric" ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-2">
                            {selectedAnswers[currentQuestion.id] || currentQuestion.options?.min || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Valore selezionato
                          </div>
                        </div>
                        
                        <div className="px-4">
                          <Slider
                            value={[parseFloat(selectedAnswers[currentQuestion.id]) || currentQuestion.options?.min || 0]}
                            onValueChange={(value) => handleSliderChange(currentQuestion.id, value)}
                            min={currentQuestion.options?.min || 0}
                            max={currentQuestion.options?.max || 100}
                            step={currentQuestion.options?.step || 1}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Min: {currentQuestion.options?.min || 0}</span>
                          <span>Max: {currentQuestion.options?.max || 100}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {currentQuestion.response.map((option) => (
                          <label
                            key={option.id}
                            className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                          >
                            <input
                              type="radio"
                              name={`question-${currentQuestion.id}`}
                              value={option.id}
                              checked={selectedAnswers[currentQuestion.id] === option.id}
                              onChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
                              className="text-primary focus:ring-primary"
                            />
                            <span className="text-sm">{option.text}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </Card>
                )}
                
                <div className="flex gap-4 pt-4 justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handlePreviousQuestion}
                    disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Precedente
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={resetQuiz}>
                      Reset Quiz
                    </Button>
                    <Button 
                      onClick={handleNextQuestion}
                      disabled={!isCurrentQuestionAnswered}
                      className="flex items-center gap-2"
                    >
                      {isLastQuestion ? (
                        <>
                          <Play className="h-4 w-4" />
                          Completa Quiz
                        </>
                      ) : (
                        <>
                          Avanti
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
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
                  {isUserAdmin() && (
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/admin")}
                      className="flex items-center gap-2"
                    >
                      <Home className="h-4 w-4" />
                      Torna al Dashboard
                    </Button>
                  )}
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