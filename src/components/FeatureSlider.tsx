import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Baby, Shield, Bell, Handshake, ChevronLeft, ChevronRight } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  desc: string;
  icon: any;
  borderColor: string;
  iconColor: string;
  glowClass: string;
}

const features: Feature[] = [
  { id: 'explore', title: 'Haritayı Keşfet', desc: 'İstanbul\'u kadın gözüyle keşfet, eğitimden sanata tüm noktaları haritada gör.', icon: Map, borderColor: 'border-t-teal-500', iconColor: 'text-teal-500', glowClass: 'hover:shadow-[0_0_25px_rgba(20,184,166,0.2)]' },
  { id: 'kids', title: 'Çocuk Dostu Alanlar', desc: 'Güvenle vakit geçirebileceğiniz park, kütüphane ve aktivite noktalarını bulun.', icon: Baby, borderColor: 'border-t-emerald-500', iconColor: 'text-emerald-500', glowClass: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]' },
  { id: 'safety', title: 'Güvenli Kalkan', desc: 'Şiddete karşı teknolojik koruma; destek hatlarına anında erişim.', icon: Shield, borderColor: 'border-t-rose-500', iconColor: 'text-rose-500', glowClass: 'hover:shadow-[0_0_25px_rgba(244,63,94,0.2)]' },
  { id: 'community', title: 'Topluluk Yardımı', desc: 'Yalnız değilsiniz, gönüllülerle dayanışma ağı kurun ve destek alın.', icon: Bell, borderColor: 'border-t-purple-500', iconColor: 'text-purple-500', glowClass: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]' },
  { id: 'economic', title: 'Ekonomik Güçlendirme', desc: 'Yerel kadın esnaflar ile aranızda kazanç ve kültür köprüsü kurun.', icon: Handshake, borderColor: 'border-t-amber-500', iconColor: 'text-amber-500', glowClass: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]' },
];

export function FeatureSlider({ isDarkMode, id }: { isDarkMode: boolean, id?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const getVisibleFeatures = () => {
    let visible = [];
    for(let i = 0; i < 3; i++) {
        visible.push(features[(currentIndex + i) % features.length]);
    }
    return visible;
  };

  return (
    <div id={id} className="relative w-full overflow-hidden py-16">
      <div className="flex justify-center items-center gap-4">
        <button onClick={() => setCurrentIndex((prev) => (prev - 1 + features.length) % features.length)} className="p-3 rounded-full bg-slate-500/10 hover:bg-slate-500/20 backdrop-blur-sm transition-colors"><ChevronLeft className="w-6 h-6" /></button>
        <div className="flex gap-6 w-full max-w-6xl justify-center">
            <AnimatePresence mode='popLayout'>
                {getVisibleFeatures().map((feat, idx) => (
                    <motion.div
                        id={`feat-${feat.id}`}
                        key={feat.id + idx}
                        layout
                        initial={{ opacity: 0, x: 50, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.95 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className={`w-80 p-7 rounded-3xl border border-white/10 border-t-4 ${feat.borderColor} backdrop-blur-2xl ${isDarkMode ? 'bg-slate-900/40' : 'bg-white/30'} shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] group ${feat.glowClass} transition-all duration-500 cursor-pointer`}
                    >
                        <feat.icon className={`w-12 h-12 ${feat.iconColor} mb-6 transition-transform duration-500 group-hover:scale-110`} />
                        <h3 className="text-2xl font-extrabold mb-4">{feat.title}</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>{feat.desc}</p>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
        <button onClick={() => setCurrentIndex((prev) => (prev + 1) % features.length)} className="p-3 rounded-full bg-slate-500/10 hover:bg-slate-500/20 backdrop-blur-sm transition-colors"><ChevronRight className="w-6 h-6" /></button>
      </div>
    </div>
  );
}
