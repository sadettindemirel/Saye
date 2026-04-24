import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Handshake, Target, Users, Languages } from 'lucide-react';

interface StoryData {
  title: string;
  yerel: string;
  desc1: string;
  diaspora: string;
  desc2: string;
  sonuc: string;
}

interface StorytellingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'tr' | 'en';
  story?: StoryData;
}

const content = {
  tr: {
    title: "İş Birliği Hikayesi: Ayşe & Leyla",
    yerel: "Yerel İşletmeci (Ayşe):",
    desc1: "Küçük bir butiğim var, dijital pazarlama ve yabancı müşterilerle iletişimde yardıma ihtiyacım var.",
    diaspora: "Diaspora Kadını (Lissa):",
    desc2: "Grafik tasarım biliyorum ve ana dilim Arapça/İngilizce. İş hayatına girmek için bir fırsat arıyorum.",
    sonuc: "Saye üzerinden buluştular. Ayşe'nin butiği dijitalleşti, Leyla hem gelir elde etti hem de yerel iş kültürünü ve dilini öğrendi.",
    ekonomik: "Ekonomik",
    kulturel: "Kültürel",
    dilsel: "Dilsel",
    btn: "Bu Köprüye Katıl",
    tebrik: "Tebrikler!",
    bridge: "Bir dayanışma köprüsü kurdunuz!",
    kapat: "Kapat"
  },
  en: {
    title: "Collaboration Story: Ayşe & Leyla",
    yerel: "Local Business Owner (Ayşe):",
    desc1: "I have a small boutique, I need help with digital marketing and communicating with foreign customers.",
    diaspora: "Diaspora Woman (Lissa):",
    desc2: "I know graphic design and my native language is Arabic/English. I am looking for an opportunity to enter business life.",
    sonuc: "They met via Saye. Ayşe's boutique digitalized, Lissa both earned income and learned local business culture and language.",
    ekonomik: "Economic",
    kulturel: "Cultural",
    dilsel: "Linguistic",
    btn: "Join This Bridge",
    tebrik: "Congratulations!",
    bridge: "You have built a solidarity bridge!",
    kapat: "Close"
  }
};

export function StorytellingModal({ isOpen, onClose, lang, story }: StorytellingModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const baseT = content[lang];
  const t = story ? { ...baseT, ...story } : baseT;
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl space-y-6">
            {!showSuccess ? (
              <>
                <h2 className="text-2xl font-bold text-slate-800">{t.title}</h2>
                <div className="space-y-4">
                    <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border-l-4 border-teal-500">
                        <strong className="text-slate-900">{t.yerel}</strong> {t.desc1}
                    </p>
                    <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border-l-4 border-amber-500">
                        <strong className="text-slate-900">{t.diaspora}</strong> {t.desc2}
                    </p>
                </div>
                
                <p className="text-sm text-slate-700 italic">
                    "{t.sonuc}"
                </p>

                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-teal-50 border border-teal-100 text-teal-800 p-3 rounded-xl flex flex-col items-center gap-1 text-center">
                        <Target className="w-5 h-5 text-teal-600"/>
                        <span className="text-[10px] font-bold">{t.ekonomik}</span>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 text-amber-800 p-3 rounded-xl flex flex-col items-center gap-1 text-center">
                        <Users className="w-5 h-5 text-amber-600"/>
                        <span className="text-[10px] font-bold">{t.kulturel}</span>
                    </div>
                    <div className="bg-sky-50 border border-sky-100 text-sky-800 p-3 rounded-xl flex flex-col items-center gap-1 text-center">
                        <Languages className="w-5 h-5 text-sky-600"/>
                        <span className="text-[10px] font-bold">{t.dilsel}</span>
                    </div>
                </div>

                <button onClick={() => setShowSuccess(true)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-slate-500/30 hover:bg-slate-800 transition-colors">
                    {t.btn}
                </button>
              </>
            ) : (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-12 space-y-4">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Handshake className="w-10 h-10 text-teal-600"/>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">{t.tebrik}</h3>
                <p className="text-slate-600">{t.bridge}</p>
                <button onClick={onClose} className="mt-8 px-6 py-3 bg-teal-500 text-white rounded-xl font-bold">{t.kapat}</button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
