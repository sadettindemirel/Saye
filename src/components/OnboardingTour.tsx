import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TourStep {
  title: string;
  desc: string;
  targetId?: string;
}

const steps: TourStep[] = [
  { title: "Saye'ye Hoş Geldiniz!", desc: "Saye, İstanbul'da yaşamınızı kolaylaştıran bir dayanışma ekosistemidir. Hızlı bir tura ne dersiniz?" },
  { title: "Haritayı Keşfet", desc: "İstanbul'u kadın gözüyle keşfedin; eğitimden sanata tüm noktalar tek bir haritada.", targetId: "feat-explore" },
  { title: "Çocuk Dostu Alanlar", desc: "Çocuklarınızla güvenle vakit geçirebileceğiniz park, kütüphane ve aktivite noktalarını bulun.", targetId: "feat-kids" },
  { title: "Güvenli Kalkan", desc: "Şiddete karşı teknolojik koruma; şiddet testi ve resmi destek hatlarına anında erişim.", targetId: "feat-safety" },
  { title: "Topluluk Yardımı", desc: "Yalnız değilsiniz. Yerel gönüllülerle dayanışma ağı kurun ve anlık destek alın.", targetId: "feat-community" },
  { title: "Ekonomik Güçlendirme", desc: "Yerel kadın esnaflar ile diaspora kadınları arasında kurulan kazanç ve kültür köprüsü.", targetId: "feat-economic" },
];

export function OnboardingTour({ isOpen, onComplete }: { isOpen: boolean; onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', arrow: false });

  useEffect(() => {
    const step = steps[currentStep];
    if (step.targetId) {
      const el = document.getElementById(step.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setPosition({
          top: `${rect.bottom + window.scrollY + 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)',
          arrow: true
        });
        return;
      }
    }
    setPosition({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', arrow: false });
  }, [currentStep]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          style={{ position: 'absolute', top: position.top, left: position.left, transform: position.transform }}
          className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-2xl pointer-events-auto border border-slate-100"
        >
          {position.arrow && <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 border-t border-l border-slate-100"></div>}
          <h2 className="text-2xl font-bold text-slate-800 mb-4">{steps[currentStep].title}</h2>
          <p className="text-slate-600 mb-8">{steps[currentStep].desc}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Adım {currentStep + 1} / {steps.length}</span>
            <div className="flex gap-2">
                <button onClick={onComplete} className="text-slate-400 hover:text-slate-600 px-4 py-2 text-sm font-semibold">Atla</button>
                <button onClick={handleNext} className="bg-teal-500 hover:bg-teal-600 px-6 py-2 rounded-xl text-white font-bold text-sm">
                {currentStep === steps.length - 1 ? "Bitir" : "İleri"}
                </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
