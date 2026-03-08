import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle, ArrowLeft, Loader2, Trophy } from "lucide-react";

const TOPICS = [
  { id: "fed-rate", title: "What is the Federal Funds Rate?", description: "How the Fed controls interest rates and why it matters for your wallet", icon: "🏦" },
  { id: "inflation", title: "How Does Inflation Affect Your Savings?", description: "Understanding purchasing power and protecting your money", icon: "📈" },
  { id: "yield-curve", title: "What is a Yield Curve?", description: "The bond market's crystal ball for predicting recessions", icon: "📉" },
  { id: "recessions", title: "How Do Recessions Start?", description: "The economic cycle and what triggers downturns", icon: "🌊" },
];

interface LessonData {
  content: string;
  quiz: { question: string; options: string[]; correctIndex: number }[];
}

interface LessonProgress {
  topic_id: string;
  score: number;
  total_questions: number;
  completed_at: string;
}

export default function Education() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [progress, setProgress] = useState<LessonProgress[]>([]);

  useEffect(() => {
    if (user) loadProgress();
  }, [user]);

  const loadProgress = async () => {
    const { data } = await supabase
      .from("lesson_progress")
      .select("topic_id, score, total_questions, completed_at")
      .eq("user_id", user!.id);
    if (data) setProgress(data);
  };

  const getTopicProgress = (topicId: string) =>
    progress.find((p) => p.topic_id === topicId);

  const completedCount = progress.length;
  const totalTopics = TOPICS.length;

  const loadLesson = async (topicId: string) => {
    setSelectedTopic(topicId);
    setLesson(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setLoading(true);

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();

      const { data, error } = await supabase.functions.invoke("education-lesson", {
        body: { topicId, profile },
      });
      if (error) throw error;
      setLesson(data);
    } catch (err: any) {
      toast({ title: "Error loading lesson", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async () => {
    if (!lesson) return;
    setQuizSubmitted(true);
    const correct = lesson.quiz.filter((q, i) => quizAnswers[i] === q.correctIndex).length;
    const total = lesson.quiz.length;

    try {
      await supabase.from("lesson_progress").upsert(
        {
          user_id: user!.id,
          topic_id: selectedTopic!,
          score: correct,
          total_questions: total,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,topic_id" }
      );
      // Refresh progress
      loadProgress();
    } catch {}

    toast({
      title: `${correct}/${total} correct!`,
      description: correct === total ? "Perfect score! 🎉" : "Keep learning — you're getting there!",
    });
  };

  const quizScore = lesson
    ? lesson.quiz.filter((q, i) => quizAnswers[i] === q.correctIndex).length
    : 0;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Education Hub
        </h1>
        <p className="mt-1 text-muted-foreground">
          Learn macro economics through your own numbers
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedTopic ? (
          <motion.div
            key="topics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Progress overview */}
            <Card className="mb-6 shadow-card">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {completedCount}/{totalTopics} lessons completed
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((completedCount / totalTopics) * 100)}%
                    </span>
                  </div>
                  <Progress value={(completedCount / totalTopics) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {TOPICS.map((topic, i) => {
                const tp = getTopicProgress(topic.id);
                return (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <button
                      onClick={() => loadLesson(topic.id)}
                      className="w-full rounded-lg border border-border bg-card p-6 text-left shadow-card transition-shadow hover:shadow-card-hover"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{topic.icon}</span>
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        {tp && (
                          <Badge
                            className={
                              tp.score === tp.total_questions
                                ? "bg-primary text-primary-foreground"
                                : "bg-accent text-accent-foreground"
                            }
                          >
                            {tp.score === tp.total_questions ? "✓ Perfect" : `${tp.score}/${tp.total_questions}`}
                          </Badge>
                        )}
                      </div>
                      <h3 className="mb-1 font-display text-lg font-semibold text-foreground">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{topic.description}</p>
                      <p className="mt-3 text-xs font-medium text-primary">
                        {tp ? "Retake lesson →" : "~3 min read →"}
                      </p>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="lesson"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <Button variant="ghost" onClick={() => setSelectedTopic(null)} className="mb-4 gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to topics
            </Button>

            {loading ? (
              <Card className="shadow-card">
                <CardContent className="flex items-center justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-3 text-muted-foreground">Generating your personalised lesson...</p>
                </CardContent>
              </Card>
            ) : lesson ? (
              <div className="space-y-6">
                <Card className="shadow-card">
                  <CardContent className="prose prose-sm max-w-none p-8">
                    <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                      {lesson.content}
                    </div>
                  </CardContent>
                </Card>

                {/* Quiz */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="font-display text-xl">Comprehension Check</CardTitle>
                    <CardDescription>Test your understanding</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {lesson.quiz.map((q, qi) => (
                      <div key={qi} className="space-y-3">
                        <p className="font-medium text-foreground">{q.question}</p>
                        <div className="space-y-2">
                          {q.options.map((opt, oi) => {
                            const isSelected = quizAnswers[qi] === oi;
                            const isCorrect = quizSubmitted && oi === q.correctIndex;
                            const isWrong = quizSubmitted && isSelected && oi !== q.correctIndex;
                            return (
                              <button
                                key={oi}
                                onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [qi]: oi })}
                                disabled={quizSubmitted}
                                className={`w-full rounded-md border p-3 text-left text-sm transition-all ${
                                  isCorrect ? "border-primary bg-accent" :
                                  isWrong ? "border-destructive bg-destructive/10" :
                                  isSelected ? "border-primary bg-accent" :
                                  "border-border bg-background hover:border-primary/50"
                                }`}
                              >
                                {opt}
                                {isCorrect && <CheckCircle className="ml-2 inline h-4 w-4 text-primary" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {!quizSubmitted ? (
                      <Button
                        onClick={submitQuiz}
                        disabled={Object.keys(quizAnswers).length < lesson.quiz.length}
                        className="bg-primary hover:bg-finora-green-hover"
                      >
                        Submit Answers
                      </Button>
                    ) : (
                      <div className="rounded-md bg-accent p-4 text-center">
                        <p className="font-mono text-2xl font-bold text-foreground">
                          {quizScore}/{lesson.quiz.length}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {quizScore === lesson.quiz.length ? "Perfect! 🎉" : "Review and try again next time!"}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
