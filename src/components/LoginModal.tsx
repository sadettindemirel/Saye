import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'tr' | 'en';
}

export function LoginModal({ isOpen, onClose, lang }: LoginModalProps) {
  const t = {
    tr: { title: "Giriş Yap", email: "E-posta", pass: "Şifre", btn: "Giriş Yap" },
    en: { title: "Login", email: "Email", pass: "Password", btn: "Login" }
  };
  const content = t[lang];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">{content.title}</h2>
                <button onClick={onClose}><X className="text-slate-400" /></button>
            </div>
            <div className="space-y-4">
                <input type="email" placeholder={content.email} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" />
                <input type="password" placeholder={content.pass} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200" />
            </div>
            <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold">{content.btn}</button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
