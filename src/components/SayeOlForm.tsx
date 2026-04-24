import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, X } from 'lucide-react';

const ISTANBUL_DISTRICTS = [
  "Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa",
  "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt",
  "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane", "Kartal", "Küçükçekmece", "Maltepe",
  "Pendik", "Sancaktepe", "Sarıyer", "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Tuzla", "Ümraniye",
  "Üsküdar", "Zeytinburnu"
];

const LANGUAGES = ["Türkçe", "Arapça", "Farsça", "İngilizce", "Rusça", "Fransızca"];
const SUPPORT_AREAS = ["Resmi Dairelerde Refakat", "Hastanede Tercüme", "Polis İrtibat Desteği"];

interface Props {
  onClose: () => void;
}

export function SayeOlForm({ onClose }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    languages: [] as string[],
    district: '',
    supportAreas: [] as string[],
    consent: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const toggleArray = (arr: string[], val: string) => 
    arr.includes(val) ? arr.filter(i => i !== val) : [...arr, val];

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
        <div className="bg-slate-900/80 backdrop-blur-lg border border-white/10 rounded-3xl p-10 text-center max-w-sm shadow-2xl">
          <Heart className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Harikasın!</h2>
          <p className="text-slate-300">Başvurunuz alındı, dayanışmanın bir parçası olduğunuz için teşekkürler!</p>
          <button onClick={onClose} className="mt-8 text-emerald-400 font-bold hover:underline">Ana Sayfaya Dön</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/70 backdrop-blur-md px-4 py-8 overflow-y-auto">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-lg bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative my-auto">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white p-2">
           <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-1">Şehrin Sesi Olmaya Hazır Mısın?</h2>
        <p className="text-slate-400 text-xs mb-6">Verileriniz KVKK kapsamında korunmaktadır ve sadece yardım eşleşmesi için kullanılacaktır.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-1">Ad Soyad</label>
            <input required className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div>
             <label className="block text-xs uppercase tracking-widest text-slate-500 mb-1">Dil Yetkinliği</label>
             <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map(lang => (
                    <label key={lang} className="flex items-center gap-2 p-2.5 bg-slate-800/30 rounded-xl cursor-pointer hover:bg-slate-800/50">
                        <input type="checkbox" checked={formData.languages.includes(lang)} onChange={() => setFormData({...formData, languages: toggleArray(formData.languages, lang)})} className="w-4 h-4 rounded text-emerald-500 focus:ring-0" />
                        <span className="text-xs text-slate-200">{lang}</span>
                    </label>
                ))}
             </div>
          </div>

          <div>
             <label className="block text-xs uppercase tracking-widest text-slate-500 mb-1">Uzmanlık/Destek Alanı</label>
             <div className="space-y-1.5">
                {SUPPORT_AREAS.map(area => (
                    <label key={area} className="flex items-center gap-2 p-2.5 bg-slate-800/30 rounded-xl cursor-pointer hover:bg-slate-800/50">
                        <input type="checkbox" checked={formData.supportAreas.includes(area)} onChange={() => setFormData({...formData, supportAreas: toggleArray(formData.supportAreas, area)})} className="w-4 h-4 rounded text-emerald-500 focus:ring-0" />
                        <span className="text-xs text-slate-200">{area}</span>
                    </label>
                ))}
             </div>
          </div>

           <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-1">İlçe Seçimi</label>
            <select required className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})}>
              <option value="">İlçe Seçin</option>
              {ISTANBUL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="pt-1">
             <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" required checked={formData.consent} onChange={e => setFormData({...formData, consent: e.target.checked})} className="w-4 h-4 rounded text-emerald-500" />
                <span className="text-[10px] text-slate-500 italic">Beyan Esastır.</span>
             </label>
          </div>

          <button type="submit" className="w-full py-3 bg-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white rounded-xl font-bold text-sm transition-all">
            Başvuruyu Gönder
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
