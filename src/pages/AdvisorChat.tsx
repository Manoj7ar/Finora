import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Send, Bot, User, Loader2, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

const SUGGESTED_QUESTIONS = [
  "Should I pay off debt or invest right now?",
  "How does the current Fed rate affect my mortgage?",
  "What's a good emergency fund target for my income?",
  "How can I protect my savings from inflation?",
];

export default function AdvisorChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const init = async () => {
      const [{ data: p }, { data: history }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("chat_messages").select("role, content").eq("user_id", user.id).order("created_at", { ascending: true }).limit(100),
      ]);
      setProfile(p);
      if (history && history.length > 0) {
        setMessages(history.map((m: any) => ({ role: m.role, content: m.content })));
      }
      setHistoryLoaded(true);
    };
    init();
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveMessage = async (role: "user" | "assistant", content: string) => {
    if (!user) return;
    await supabase.from("chat_messages").insert({ user_id: user.id, role, content });
  };

  const clearHistory = async () => {
    if (!user) return;
    await supabase.from("chat_messages").delete().eq("user_id", user.id);
    setMessages([]);
    toast({ title: "Chat cleared" });
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    await saveMessage("user", userMsg.content);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ messages: allMessages, profile }),
      });

      if (resp.status === 429) {
        toast({ title: "Rate limit", description: "Too many requests. Please wait a moment.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      if (resp.status === 402) {
        toast({ title: "Credits exhausted", description: "AI credits have run out.", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      const updateAssistant = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) updateAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (assistantSoFar) {
        await saveMessage("assistant", assistantSoFar);
      }
    } catch (err: any) {
      toast({ title: "Chat error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container flex max-w-3xl flex-col px-4 py-6 sm:px-8 sm:py-8"
      style={{ height: "calc(100vh - 5rem)" }}
    >
      <div className="mb-4 flex items-start justify-between gap-3 sm:mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            AI Financial Advisor
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Ask anything about your finances — powered by your real data
          </p>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearHistory} className="shrink-0 gap-1">
            <Trash2 className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Clear</span>
          </Button>
        )}
      </div>

      {/* Chat messages */}
      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-border bg-card p-3 sm:space-y-4 sm:p-4">
        {messages.length === 0 && historyLoaded && (
          <div className="flex h-full flex-col items-center justify-center gap-5 py-8 sm:gap-6 sm:py-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground/[0.06]">
              <Bot className="h-7 w-7 text-foreground" />
            </div>
            <p className="text-center text-sm text-muted-foreground sm:text-base">
              Hi! I'm your personal financial advisor. Ask me anything about your money.
            </p>
            <div className="grid w-full gap-2 sm:grid-cols-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-left text-xs text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground sm:px-4 sm:py-3 sm:text-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 sm:gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent sm:h-7 sm:w-7">
                <Bot className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2.5 text-sm sm:max-w-[80%] sm:px-4 sm:py-3 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
            {msg.role === "user" && (
              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-muted sm:h-7 sm:w-7">
                <User className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
              </div>
            )}
          </motion.div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Thinking...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
        className="mt-3 flex gap-2 sm:mt-4"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your finances..."
          disabled={isLoading}
          className="h-11 flex-1 rounded-xl border-border bg-card text-base sm:h-12"
        />
        <Button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="h-11 w-11 rounded-xl bg-primary hover:bg-finora-green-hover sm:h-12 sm:w-12"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </motion.div>
  );
}
