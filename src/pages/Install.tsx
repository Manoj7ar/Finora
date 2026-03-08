import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Smartphone, Share, ChevronRight, Check } from "lucide-react";
import logoImg from "@/assets/logo.png";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => setInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="container max-w-lg py-12 sm:py-20"
    >
      <div className="text-center mb-10">
        <img src={logoImg} alt="Finora" className="h-16 w-16 mx-auto mb-4" />
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Install Finora
        </h1>
        <p className="mt-3 text-muted-foreground">
          Add Finora to your home screen for the best experience — instant access, offline support, and a native app feel.
        </p>
      </div>

      {installed ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-8 text-center">
            <Check className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">Finora is installed!</h2>
            <p className="text-sm text-muted-foreground mb-4">You can now find it on your home screen.</p>
            <Link to="/dashboard">
              <Button>Go to Dashboard <ChevronRight className="h-4 w-4 ml-1" /></Button>
            </Link>
          </CardContent>
        </Card>
      ) : deferredPrompt ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Download className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">Ready to install</h2>
            <p className="text-sm text-muted-foreground mb-6">Tap the button below to add Finora to your home screen.</p>
            <Button onClick={handleInstall} size="lg" className="rounded-full px-8">
              <Download className="h-4 w-4 mr-2" /> Install Finora
            </Button>
          </CardContent>
        </Card>
      ) : isIOS ? (
        <Card>
          <CardContent className="p-8">
            <Smartphone className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-center mb-6">Install on iPhone / iPad</h2>
            <ol className="space-y-4">
              {[
                { icon: Share, text: "Tap the Share button in Safari (bottom bar)" },
                { icon: Download, text: 'Scroll down and tap "Add to Home Screen"' },
                { icon: Check, text: 'Tap "Add" to confirm' },
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <step.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm">{step.text}</span>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Smartphone className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">Install from browser</h2>
            <p className="text-sm text-muted-foreground">
              Open the browser menu (⋮) and select "Install app" or "Add to Home Screen" to install Finora.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 grid grid-cols-3 gap-3 text-center">
        {[
          { label: "Offline ready", desc: "Works without internet" },
          { label: "Fast launch", desc: "Instant from home screen" },
          { label: "Always fresh", desc: "Auto-updates in background" },
        ].map((perk) => (
          <div key={perk.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm font-medium text-foreground">{perk.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{perk.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
