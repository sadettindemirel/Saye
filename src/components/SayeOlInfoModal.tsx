import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SayeOlInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDarkMode: boolean;
  lang: 'tr' | 'en';
}

const content = {
  tr: {
    title: "Saye Ol: Dayanışmanın Parçası Ol",
    desc: "Saye Ol sistemine kayıt olduğunuzda, 'Topluluk Yardımı' paneline erişim sağlarsınız. Burada, dil bariyeri yaşayan veya desteğe ihtiyaç duyan diğer kadınlara rehberlik edebilir ve gönüllü yardım ilanlarına yanıt vererek gerçek bir değişim yaratabilirsiniz.",
    steps: ["Kayıt Ol", "Panele Gir", "Yardıma Başla"],
    btn: "Anladım, Kayıt Ol"
  },
  en: {
    title: "Be a Saye: Be Part of Solidarity",
    desc: "When you register to the Saye system, you get access to the 'Community Help' panel. Here, you can guide other women who are experiencing language barriers or in need of support, and make a real difference by responding to volunteer help requests.",
    steps: ["Sign Up", "Enter Panel", "Start Helping"],
    btn: "I Understand, Sign Up"
  }
};

export function SayeOlInfoModal({ isOpen, onClose, onConfirm, isDarkMode, lang }: SayeOlInfoModalProps) {
  const t = content[lang];
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`absolute inset-0 ${isDarkMode ? 'bg-slate-950/90' : 'bg-slate-950/80'} backdrop-blur-sm`} onClick={onClose} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`relative w-full max-w-md ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white/90 border-white'} p-8 rounded-3xl border shadow-2xl space-y-6 backdrop-blur-md`}>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{t.title}</h2>
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{t.desc}</p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div><div className={`p-3 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800'} rounded-full mb-2`}>1</div>{t.steps[0]}</div>
                <div><div className={`p-3 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800'} rounded-full mb-2`}>2</div>{t.steps[1]}</div>
                <div><div className={`p-3 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800'} rounded-full mb-2`}>3</div>{t.steps[2]}</div>
            </div>
            <button onClick={onConfirm} className="w-full bg-teal-500 hover:bg-teal-400 py-4 rounded-xl font-bold shadow-lg shadow-teal-500/30 animate-pulse text-white">{t.btn}</button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
