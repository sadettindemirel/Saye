import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, Heart, Share2, MapPin, Clock } from 'lucide-react';
import { SayeOlInfoModal } from './SayeOlInfoModal';

interface Alert {
  id: number;
  category: string;
  location: string;
  time: string;
  desc: string;
  isSOS: boolean;
}

const INITIAL_ALERTS: Alert[] = [
  { id: 1, category: "#AcilTercüme", location: "Fatih", time: "5 dk önce", desc: "Hastane işlemleri için yardımcı olacak birine ihtiyacım var.", isSOS: true },
  { id: 2, category: "#SosyalDestek", location: "Kadıköy", time: "15 dk önce", desc: "Mutfak alışverişi için eşlik edecek gönüllü arıyoruz.", isSOS: false },
  { id: 3, category: "#BilgiPaylaşımı", location: "Beşiktaş", time: "1 saat önce", desc: "Kurs kayıtları hakkında bilgi verebilecek biri.", isSOS: false },
  { id: 4, category: "#AcilSağlık", location: "Şişli", time: "2 saat önce", desc: "Yabancı bir arkadaşım İstanbul'a yeni geldi, Türkçe bilmiyor ve küçük oğlu hasta. Doktora gitmemiz gerekiyor, yardımcı olabilecek biri var mı?", isSOS: true },
];
export default function DayanismaAgi({ onBack, lang, isDarkMode }: { onBack: () => void, lang: 'tr' | 'en', isDarkMode: boolean }) {
  const [selectedAlertId, setSelectedAlertId] = useState<number | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [formData, setFormData] = useState({ category: '', location: '', desc: '', isSOS: false });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert: Alert = {
        id: Date.now(),
        category: formData.isSOS ? `#Acil${formData.category}` : formData.category,
        location: formData.location,
        time: 'Az önce',
        desc: formData.desc,
        isSOS: formData.isSOS,
    };
    setAlerts(prev => [newAlert, ...prev]);
    setIsFormOpen(false);
    setFormData({ category: '', location: '', desc: '', isSOS: false });
  };

  const handleShare = async (alert: Alert) => {
    const text = `Dayanışma Ağı'nda bir yardım çağrısı var:
Kategori: ${alert.category}
Konum: ${alert.location}
Detay: ${alert.desc}
Hadi destek olalım!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Dayanışma Ağı - Yardım Çağrısı',
          text: text,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      alert('Tarayıcınız paylaşımı desteklemiyor. Metin panoya kopyalandı.');
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a] text-white font-sans flex flex-col">
      {/* HEADER */}
      <div className="bg-slate-900 border-b border-white/10 px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors text-slate-300">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold italic tracking-tight">Dayanışma Ağı</h1>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {alerts.map(alert => {
                const isSelected = selectedAlertId === alert.id;
                const isAcil = alert.category.startsWith('#Acil');
                return (
                    <motion.div 
                        key={alert.id}
                        onClick={() => setSelectedAlertId(alert.id)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, scale: isSelected ? 1.02 : 1 }}
                        className={`relative p-5 rounded-3xl border transition-all cursor-pointer ${
                            isSelected 
                                ? 'border-teal-500 bg-white/10 ring-1 ring-teal-500/50' 
                                : isAcil
                                    ? 'border-rose-500/50 bg-rose-950/20' 
                                    : 'border-white/10 bg-white/5'
                        } backdrop-blur-md`}
                    >
                    {isAcil && <div className="absolute inset-0 rounded-3xl ring-4 ring-rose-500/50 animate-pulse"></div>}
                    <div className="flex justify-between items-start mb-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${isAcil ? 'bg-rose-500 text-white' : 'bg-teal-500/20 text-teal-300'}`}>{alert.category}</span>
                        <div className="flex gap-3 text-slate-400 text-xs">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.location}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{alert.time}</span>
                        </div>
                    </div>
                    <p className="text-sm text-slate-200 mb-4">{alert.desc}</p>
                    <div className="flex gap-2">
                        <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                            <Heart className="w-4 h-4" /> Destek Ol
                        </button>
                        <button onClick={() => handleShare(alert)} className="bg-slate-800 hover:bg-slate-700 p-2 rounded-xl text-slate-300">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
                );
            })}
        </div>


       {/* Footer */}
       <div className="p-6 bg-slate-900 border-t border-white/10 flex items-center justify-between">
          <p className="text-[10px] text-slate-500 max-w-sm">Topluluk paylaşımlarında güven ve beyan esastır. Lütfen acil durumlarda resmi kanalları (183/KADES) da kullanmayı unutmayın.</p>
          <button onClick={() => setIsInfoModalOpen(true)} className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg shadow-teal-500/20">
             <Plus className="w-4 h-4" /> Saye Ol / İlan Oluştur
          </button>
       </div>
        
        <AnimatePresence>
          <SayeOlInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} onConfirm={() => { setIsInfoModalOpen(false); setIsFormOpen(true); }} isDarkMode={isDarkMode} lang={lang} />
          {isFormOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
              <motion.form initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onSubmit={handleFormSubmit} className="relative w-full max-w-md bg-slate-900 p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
                <h2 className="text-xl font-bold">Yardım / İlan Oluştur</h2>
                <input required placeholder="Kategori (örn: #SosyalDestek)" className="w-full bg-slate-800 p-3 rounded-xl border border-white/10" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                <input required placeholder="Konum" className="w-full bg-slate-800 p-3 rounded-xl border border-white/10" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                <textarea required placeholder="Açıklama" className="w-full bg-slate-800 p-3 rounded-xl border border-white/10 h-32" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} />
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={formData.isSOS} onChange={e => setFormData({...formData, isSOS: e.target.checked})} className="w-4 h-4 accent-rose-500" />
                  Acil Durum (#Acil)
                </label>
                <button type="submit" className="w-full bg-teal-500 py-3 rounded-xl font-bold">Oluştur</button>
              </motion.form>
            </div>
          )}
        </AnimatePresence>
    </div>
  );
}
