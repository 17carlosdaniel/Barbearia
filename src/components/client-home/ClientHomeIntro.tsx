import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Search, CalendarClock, ShieldCheck, MapPin, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientHomeIntroProps {
  firstName: string;
  onSkip: () => void;
  onFinish: (payload: { locationStatus: "granted" | "denied" | "unavailable" | "skipped" }) => void;
}

const ClientHomeIntro = ({ firstName, onSkip, onFinish }: ClientHomeIntroProps) => {
  const [step, setStep] = useState(0);
  const [requestingLocation, setRequestingLocation] = useState(false);
  const [skipAvailable, setSkipAvailable] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setSkipAvailable(true), 2000);
    return () => window.clearTimeout(t);
  }, []);

  const screens = useMemo(
    () => [
      {
        icon: Scissors,
        title: "Seu próximo corte começa aqui",
        subtitle: "Encontre as melhores barbearias perto de você.",
        cta: "Explorar agora",
        imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Cadeira premium de barbearia",
      },
      {
        icon: CalendarClock,
        title: "Agende em segundos",
        subtitle: "Escolha o serviço, horário e pague na hora. Sem fila.",
        cta: "Próximo",
        imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Atendimento na barbearia",
      },
      {
        icon: ShieldCheck,
        title: "Profissionais verificados",
        subtitle: "Veja avaliações reais antes de escolher.",
        cta: "Próximo",
        imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Profissional verificado",
      },
      {
        icon: MapPin,
        title: "Pronto pra mudar o visual?",
        subtitle: "Ative sua localização para ver barbearias próximas.",
        cta: "Ativar localização",
        imageUrl: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Localização de barbearias",
      },
    ],
    [],
  );

  const handlePrimary = () => {
    if (step < screens.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }
    if (!navigator.geolocation) {
      onFinish({ locationStatus: "unavailable" });
      return;
    }
    setRequestingLocation(true);
    navigator.geolocation.getCurrentPosition(
      () => { setRequestingLocation(false); onFinish({ locationStatus: "granted" }); },
      () => { setRequestingLocation(false); onFinish({ locationStatus: "denied" }); },
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 300000 },
    );
  };

  const ScreenIcon = screens[step].icon;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      {/* Card pequeno */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-sm bg-card rounded-2xl overflow-hidden shadow-2xl border border-border/40"
      >
        {/* Imagem topo do card */}
        <div className="relative w-full h-40 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={screens[step].imageUrl}
              src={screens[step].imageUrl}
              alt={screens[step].imageAlt}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />

          {/* Pular */}
          {skipAvailable && (
            <button
              type="button"
              onClick={onSkip}
              className="absolute top-3 right-3 text-xs font-medium text-white/90 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full"
            >
              Pular
            </button>
          )}
        </div>

        {/* Corpo do card */}
        <div className="px-5 pt-4 pb-5">
          {/* Progress dots */}
          <div className="flex gap-1.5 mb-4">
            {screens.map((_, i) => (
              <div key={i} className="h-1 rounded-full bg-muted overflow-hidden flex-1">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: i <= step ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            ))}
          </div>

          {/* Ícone + texto */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                  <ScreenIcon className="w-4 h-4 text-primary" />
                </div>
                {step === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Olá, <span className="text-primary font-semibold">{firstName}</span> 👋
                  </p>
                )}
              </div>
              <h2 className="text-lg font-bold text-foreground leading-snug mb-1">
                {screens[step].title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {screens[step].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Botões */}
          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              disabled={step === 0 || requestingLocation}
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-border text-muted-foreground disabled:opacity-30 active:scale-95 transition-transform flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <Button
              size="sm"
              className="flex-1 h-10 text-sm rounded-xl font-semibold"
              onClick={handlePrimary}
              disabled={requestingLocation}
            >
              {step === screens.length - 1
                ? <MapPin className="w-4 h-4 mr-1.5" />
                : <Search className="w-4 h-4 mr-1.5" />}
              {requestingLocation ? "Ativando..." : screens[step].cta}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default ClientHomeIntro;
