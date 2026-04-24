import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Compass, Handshake } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'tr' | 'en';
}

const content = {
  tr: {
    title: "Saye: Dayanışmanın ve Güvenin Dijital Ekosistemi",
    intro: "İstanbul gibi dinamik bir metropolde, yerinden edilen veya yeni bir yaşam kuran diaspora kadınları; dil bariyerleri, güvenlik endişeleri ve ekonomik hayata uyum sağlama noktasında eşsiz zorluklarla yüzleşmektedir. Farsça kökenli 'Saye' (gölge, koruma, himaye) kelimesinden ismini alan projemiz, bu zorlukların ötesinde bir 'güvenli liman' inşa etme vizyonuyla doğmuştur. Amacımız, her kadının varlığını bir 'gölge' gibi sarmalayarak ona ihtiyaç duyduğu alanı ve huzuru sunmaktır.",
    philosophy: "Saye'nin temelinde sarsılmaz bir etik duruş yatar: 'Beyan Esastır'. Kadının sesine, yaşadığı deneyime ve ihtiyaç duyduğu desteğe duyulan bu mutlak güven, toplumsal dayanışmamızın sarsılmaz temeli ve rehberidir. Bizler, hikayelerin anlatılma biçimine değil, kadınların yaşam serüveninin doğruluğuna inanıyoruz.",
    pillars: [
      { id: 'Keşif', title: 'Keşif', desc: 'Bilinmezi tanıdık kılma çabasıdır. Şehri yabancı olmaktan çıkarıp, tüm kadınların kendilerini ait hissettiği bir ev\'e dönüştürmeyi amaçlıyoruz.', icon: Compass },
      { id: 'Kalkan', title: 'Kalkan', desc: 'Dijital teknolojinin sağladığı güvenlik imkanlarıyla, en zor anlarda bile yalnız olmadığınızı hissettiren, erişilebilir bir koruma zırhı sunuyoruz.', icon: Shield },
      { id: 'Köprü', title: 'Köprü', desc: 'Yerel işletmeci kadınlar ile diaspora kadınlarını Kazan-Kazan temelinde bir araya getirerek, ekonomik ve kültürel bağların güçlendiği sürdürülebilir bir dayanışma modeli örüyoruz.', icon: Handshake },
    ],
    footer: "Saye, bir yazılım projesinden çok daha fazlasıdır. Biz, dijital vatandaşlık ve kültürlerarası iletişim araçlarını kullanarak, İstanbul'un her köşesinde örülen bir 'Dayanışma Ekosistemi' kurguluyoruz. Birlikte, daha güvenli, daha eşit ve daha bağlı bir gelecek inşa ediyoruz."
  },
  en: {
    title: "Saye: Digital Ecosystem of Solidarity and Trust",
    intro: "In a dynamic metropolis like Istanbul, displaced diaspora women or those building a new life face unique challenges regarding language barriers, safety concerns, and integration into economic life. Projejct Saye, named after the Persian word 'Saye' (shadow, protection, patronage), was born with the vision of building a 'safe haven' beyond these challenges. Our goal is to envelop every woman's presence like a 'shadow' and offer her the space and peace she needs.",
    philosophy: "At the core of Saye lies an unwavering ethical stance: 'Declaration is Principal'. This absolute trust in a woman's voice, her lived experience, and the support she needs is the unshakable foundation and guide of our social solidarity. We believe in the truth of women's life journeys, not in the way stories are told.",
    pillars: [
      { id: 'Discovery', title: 'Discovery', desc: "The effort to make the unknown familiar. We aim to take the city out of being a 'foreign' place and turn it into a 'home' where all women feel they belong.", icon: Compass },
      { id: 'Shield', title: 'Shield', desc: 'With the security capabilities provided by digital technology, we offer an accessible shield of protection that makes you feel you are never alone, even in the most difficult moments.', icon: Shield },
      { id: 'Bridge', title: 'Bridge', desc: 'By bringing together local merchant women and diaspora women on a Win-Win basis, we are weaving a sustainable solidarity model where economic and cultural ties are strengthened.', icon: Handshake },
    ],
    footer: "Saye is much more than a software project. Using digital citizenship and intercultural communication tools, we are constructing a 'Solidarity Ecosystem' woven in every corner of Istanbul. Together, we are building a safer, more equal, and more connected future."
  }
};

export function AboutModal({ isOpen, onClose, lang }: AboutModalProps) {
  const t = content[lang];
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-3xl bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">{t.title}</h2>
              <button onClick={onClose}><X className="text-slate-400" /></button>
            </div>
            <p className="text-slate-600 leading-relaxed">{t.intro}</p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
               <h3 className="font-bold text-slate-800 mb-2">Beyan Esastır</h3>
               <p className="text-slate-600 text-sm leading-relaxed italic">{t.philosophy}</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
                {t.pillars.map((pillar) => (
                    <div key={pillar.id} className="p-4 border border-slate-100 rounded-2xl space-y-2">
                        <pillar.icon className="w-8 h-8 text-teal-600 mb-2" />
                        <h4 className="font-bold text-slate-800">{pillar.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{pillar.desc}</p>
                    </div>
                ))}
            </div>

            <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">{t.footer}</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
