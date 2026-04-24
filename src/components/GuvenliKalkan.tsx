import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Info, 
  ShieldAlert, 
  Check, 
  X,
  ExternalLink,
  Store,
  AppWindow,
  Zap
} from 'lucide-react';
import MapWidget from './MapWidget';
import EmergencyMap from './EmergencyMap';

type QuizState = {
  physical: boolean | null;
  sexual: boolean | null;
  digital: boolean | null;
  economic: boolean | null;
};

// SafeRender Block
function SafeRender({ children }: { children: ReactNode }) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Render error in GuvenliKalkan:", error);
    return (
       <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
         <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
         <h3 className="text-xl font-bold text-red-400 mb-2">Sistem Hatası</h3>
         <p className="text-slate-300">Bir hata oluştu. Lütfen sayfayı yenileyin veya Destek Hattını (183) arayın.</p>
       </div>
    );
  }
}

const STEPS = [
  {
    id: "physical",
    question: "Fiziksel bir tehdit veya zarar görme durumu var mı?",
    type: "boolean"
  },
  {
    id: "sexual",
    question: "Rızanız dışında bir eyleme zorlanıyor musunuz?",
    type: "boolean"
  },
  {
    id: "digital",
    question: "Dijital hesaplarınız kontrol ediliyor mu veya siber zorbalığa uğruyor musunuz?",
    type: "boolean"
  },
  {
    id: "economic",
    question: "Maddi özgürlüğünüzün veya çalışma hakkınızın kısıtlandığını hissediyor musunuz?",
    type: "boolean"
  }
];

interface Props {
  onBack: () => void;
}

export default function GuvenliKalkan({ onBack }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizState>({
    physical: null,
    sexual: null,
    digital: null,
    economic: null,
  });
  const [showResults, setShowResults] = useState(false);
  const [showPhysicalMap, setShowPhysicalMap] = useState(false);

  const handleAnswer = (answer: boolean) => {
    const currentStepId = STEPS[stepIndex].id as keyof QuizState;
    setAnswers(prev => ({ ...prev, [currentStepId]: answer }));
    
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(prev => prev + 1);
    } else {
       setShowResults(true);
    }
  };

  const handleQuickExit = () => {
    window.location.replace("https://www.accuweather.com");
  };

  const currentStep = STEPS[stepIndex];
  const progressPercent = ((stepIndex + (showResults ? 1 : 0)) / STEPS.length) * 100;

  type ResultPriority = 'CRITICAL' | 'TARGETED' | 'SAFE' | 'DEFAULT';

  const getResultPriority = (): ResultPriority => {
    if (answers.physical === true || answers.sexual === true) {
      return 'CRITICAL'; // Priority 1
    }
    if (answers.digital === true || answers.economic === true) {
      return 'TARGETED'; // Priority 2
    }
    if (answers.physical === false && answers.sexual === false && answers.digital === false && answers.economic === false) {
      return 'SAFE'; // Priority 3
    }
    return 'DEFAULT'; // Fallback
  };

  const priority = getResultPriority();
  const isHighRisk = answers.physical === true || answers.sexual === true || answers.economic === true;

  const renderResult = () => {
    // New High Risk / Emergency Result Screen
    if (isHighRisk) {
      return (
        <div className="space-y-6 pb-40">
           {/* Supportive Message */}
           <div className="bg-pink-500/10 border border-pink-500/20 p-6 rounded-3xl backdrop-blur-md">
              <div className="flex items-center gap-3 mb-2 text-pink-400">
                <ShieldAlert className="w-6 h-6" />
                <h3 className="font-bold text-lg">Yalnız Değilsiniz</h3>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">
                 Yalnız değilsiniz. Size en yakın güvenli destek merkezlerini aşağıda görebilir ve tek tıkla yardım alabilirsiniz. Güvenliğiniz bizim önceliğimizdir.
              </p>
           </div>

           {/* Emergency Map */}
           <div className="space-y-4">
              <h4 className="font-bold text-slate-300 text-sm px-1 uppercase tracking-wider">Size En Yakın Destek Merkezleri</h4>
              <EmergencyMap />
           </div>

           {/* Informational Note */}
           <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
              <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-pink-400" />
                 Yasal Haklarınız Üzerine
              </h4>
              <p className="text-sm text-slate-400">
                 6284 Sayılı Kanun kapsamında koruma talebinde bulunma, sığınma hakkı ve geçici maddi yardım alma haklarınız bulunmaktadır. Aşağıdaki kanallardan anında destek alabilirsiniz.
              </p>
           </div>

           {/* Sticky Emergency Actions Bar */}
           <div className="fixed bottom-0 left-0 right-0 p-8 sm:p-10 bg-slate-900/40 backdrop-blur-lg border-t border-white/10 z-[2000] flex flex-col sm:flex-row gap-4">
              <a 
                href="https://play.google.com/store/apps/details?id=tr.gov.egm.kades" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
              >
                 <AppWindow className="w-5 h-5" /> KADES'i İndir/Aç
              </a>
              <a 
                href="tel:183" 
                className="flex-1 py-5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-pink-600/20"
              >
                 <Zap className="w-5 h-5" /> 183 Destek Hattı
              </a>
           </div>
        </div>
      );
    }

    switch (priority) {
      case 'CRITICAL':
        return (
          <div className="bg-white/10 backdrop-blur-lg border border-red-500/30 p-8 rounded-[32px] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
               <AlertTriangle className="w-32 h-32 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
               Acil Destek ve Koruma
            </h3>
            <p className="text-slate-300 mb-6 font-medium">6284 Sayılı Kanun kapsamında devlet güvencesi altındasınız.</p>
            
            <div className="bg-yellow-400/10 backdrop-blur-md border border-yellow-400/20 p-5 rounded-2xl mb-8 flex items-start gap-4">
               <Info className="w-6 h-6 text-yellow-400 shrink-0 mt-1" />
               <div>
                 <div className="font-bold text-yellow-400 mb-1 text-lg">Beyan Esastır</div>
                 <p className="text-sm text-yellow-100">Başvuru için darp raporu veya delil zorunlu değildir. Tek bir beyanınızla koruma kararı çıkartılabilir.</p>
               </div>
            </div>

            <div className="space-y-4">
              <a href="tel:112" style={{ minHeight: '60px' }} className="flex items-center justify-between w-full p-4 bg-red-500/20 border border-red-500/50 rounded-2xl hover:bg-red-500/30 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-red-500/40">
                     <Phone className="w-6 h-6 text-white" />
                   </div>
                   <div className="text-left">
                     <div className="font-bold text-lg">112 Acil Çağrı Merkezi</div>
                     <div className="text-sm text-red-200">Polis, Ambulans, Jandarma</div>
                   </div>
                </div>
              </a>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mt-4">
                 <div className="flex items-center gap-3 mb-4">
                   <ShieldAlert className="w-6 h-6 text-[#2dd4bf]" />
                   <h4 className="font-bold text-lg">ŞÖNİM ve KADES</h4>
                 </div>
                 <p className="text-sm text-slate-300 mb-4">Şiddet Önleme ve İzleme Merkezleri (ŞÖNİM) 81 ilde hizmetinizdedir. Ayrıca akıllı telefonunuzdan KADES uygulamasını indirebilirsiniz.</p>
                 <button 
                     onClick={() => setShowPhysicalMap(!showPhysicalMap)}
                     className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#2dd4bf]/20 text-[#2dd4bf] hover:bg-[#2dd4bf]/30 border border-[#2dd4bf]/30 rounded-xl font-medium transition-all" 
                     style={{ minHeight: '44px' }}
                 >
                    <MapPin className="w-5 h-5" />
                    {showPhysicalMap ? "Haritayı Gizle" : "En Yakın Merkezi Haritada Gör"}
                 </button>
                 {showPhysicalMap && (
                   <div className="mt-4">
                     <MapWidget />
                   </div>
                 )}
              </div>
            </div>
          </div>
        );
      case 'TARGETED':
        return (
          <div className="bg-white/10 backdrop-blur-lg border border-indigo-500/30 p-8 rounded-[32px]">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
               <Store className="w-7 h-7 text-indigo-400" />
               Bilgi ve Destek
            </h3>
            
            <p className="text-slate-300 mb-6 text-sm">Durumunuzu inceledik. Ekonomik kısıtlamalar veya dijital zorbalık durumunda başvurabileceğiniz temel haklar ve destek merkezleri aşağıdadır.</p>

            <div className="space-y-4">
               <a href="tel:183" style={{ minHeight: '60px' }} className="flex items-center justify-between w-full p-4 bg-indigo-500/20 border border-indigo-500/50 rounded-2xl hover:bg-indigo-500/30 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-indigo-500/40">
                     <Phone className="w-6 h-6 text-white" />
                   </div>
                   <div className="text-left">
                     <div className="font-bold text-lg">ALO 183 Hukuki Rehberlik</div>
                     <div className="text-sm text-indigo-200">6284 Sayılı Kanun destekleri, nafaka ve genel haklar rehberliği.</div>
                   </div>
                </div>
              </a>

              <a href="tel:166" style={{ minHeight: '60px' }} className="flex items-center justify-between w-full p-4 bg-purple-500/20 border border-purple-500/50 rounded-2xl hover:bg-purple-500/30 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/40">
                     <Phone className="w-6 h-6 text-white" />
                   </div>
                   <div className="text-left">
                     <div className="font-bold text-lg">ALO 166 Siber Suçlar</div>
                     <div className="text-sm text-purple-200">Dijital zorbalık durumunda ekran görüntüsü alarak arayın.</div>
                   </div>
                </div>
              </a>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                 <div className="font-bold text-lg mb-1">İSMEK & Meslek Edindirme</div>
                 <p className="text-sm text-slate-300 mb-4">Mesleki eğitim ve istihdam destek merkezleri ile ekonomik bağımsızlığınızı kazanabilirsiniz.</p>
                 <button className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-xl font-medium transition-all" style={{ minHeight: '44px' }}>
                    <MapPin className="w-5 h-5" />
                    Yakındaki Kurs Merkezlerini Gör
                 </button>
              </div>
            </div>
          </div>
        );
      case 'SAFE':
        return (
          <div className="bg-white/10 backdrop-blur-lg border border-[#2dd4bf]/30 p-8 rounded-[32px]">
            <h3 className="text-xl font-semibold mb-2 text-[#2dd4bf]">Güvendesiniz</h3>
            <p className="text-slate-300 mb-6">Testi tamamladınız. Şu an için herhangi bir acil risk tespit edilmedi. Ancak tedbiri elden bırakmamak her zaman önemlidir.</p>
            
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl mb-6">
              <h4 className="font-bold mb-2">Önleyici İpuçları:</h4>
              <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
                <li>Acil durum numaralarını telefonunuza kaydedin.</li>
                <li>Konum paylaşma özelliklerini güvendiğiniz kişilerle açık tutun.</li>
                <li>Şüpheli bir durumda ALO 183'ten her zaman ücretsiz danışmanlık talep edebilirsiniz.</li>
              </ul>
            </div>

            <a href="tel:183" className="flex items-center justify-between w-full p-4 bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 rounded-2xl hover:bg-[#2dd4bf]/20 transition-all">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#2dd4bf] rounded-full flex items-center justify-center shadow-[#2dd4bf]/40">
                   <Phone className="w-6 h-6 text-[#0f172a]" />
                 </div>
                 <div className="text-left">
                   <div className="font-bold text-lg">ALO 183</div>
                   <div className="text-sm text-slate-300">Sosyal Destek Hattı</div>
                 </div>
              </div>
              <ExternalLink className="w-5 h-5 text-[#2dd4bf]" />
            </a>
          </div>
        );
      case 'DEFAULT':
      default:
        // Absolute fallback to prevent a blank white screen
        return (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-[32px] text-center">
             <h3 className="text-xl font-semibold mb-4">Değerlendirme Tamamlandı</h3>
             <p className="text-slate-300 mb-6">Test bilgileri alındı. Herhangi bir şüpheli veya acil durumda 112 veya 183'ü arayabilirsiniz.</p>
             <a href="tel:112" style={{ minHeight: '60px' }} className="flex items-center justify-center gap-2 w-full p-4 bg-red-500/20 text-white rounded-2xl mb-4 font-bold border border-red-500/50">
               <Phone className="w-5 h-5" /> 112 Acil Yardım
             </a>
             <a href="tel:183" style={{ minHeight: '60px' }} className="flex items-center justify-center gap-2 w-full p-4 bg-white/5 text-white rounded-2xl border border-white/10 font-bold">
               <Phone className="w-5 h-5" /> 183 Sosyal Destek
             </a>
          </div>
        );
    }
  };

  return (
    <SafeRender>
      <div className="fixed inset-0 z-50 bg-[#0f172a] text-white font-sans overflow-y-auto selection:bg-[#2dd4bf] selection:text-[#0f172a]">
      {/* Panic Button - Always available */}
      <div className="fixed top-6 right-6 z-[2100] flex flex-col items-end group">
        <button 
          onClick={handleQuickExit}
          className="flex items-center gap-2.5 px-6 py-2.5 bg-red-600/5 hover:bg-red-600/15 text-red-500 font-bold rounded-full border border-red-500/20 hover:border-red-500/40 shadow-sm transition-all duration-300 active:scale-95 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
        >
          <X className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
          <span className="tracking-[0.12em] text-[10px] sm:text-[11px] uppercase">Acil Çıkış</span>
        </button>
        
        <div className="mt-2.5 px-2 max-w-[170px] text-right pointer-events-none">
          <p className="text-[9px] text-slate-500 font-bold leading-relaxed tracking-[0.05em] uppercase opacity-40 group-hover:opacity-70 transition-opacity duration-300">
             Sayfayı kapatır ve hava durumuna yönlendirir.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-24 pb-32 min-h-screen flex flex-col relative z-10">
        
        {/* Header & Back Button */}
        <div className="flex items-center gap-4 mb-12">
          {!showResults && (
            <button 
              onClick={onBack}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10"
              aria-label="Geri dön"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          {showResults && (
             <button 
                onClick={() => { setShowResults(false); setStepIndex(0); setAnswers({ physical: null, sexual: null, digital: null, economic: null }); }}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10"
                aria-label="Tekrar başla"
              >
                <ArrowLeft className="w-5 h-5" />
             </button>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#2dd4bf]" />
            Güvenli Kalkan
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full mb-12 overflow-hidden">
          <motion.div 
            className="h-full bg-[#2dd4bf]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <div className="flex-1 flex flex-col justify-center relative">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 sm:p-12 rounded-[32px] shadow-2xl"
              >
                <div className="mb-4 text-[#2dd4bf] font-medium text-sm tracking-widest uppercase">
                  Soru {stepIndex + 1} / {STEPS.length}
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold mb-10 leading-tight">
                  {currentStep.question}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAnswer(true)}
                    className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-white/5 hover:bg-[#2dd4bf]/20 border border-white/10 rounded-2xl text-lg font-medium transition-all active:scale-[0.98]"
                    style={{ minHeight: '60px' }}
                  >
                    <Check className="w-5 h-5" />
                    Evet
                  </button>
                  <button
                    onClick={() => handleAnswer(false)}
                    className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-lg font-medium transition-all active:scale-[0.98]"
                    style={{ minHeight: '60px' }}
                  >
                    <X className="w-5 h-5" />
                    Hayır
                  </button>
                </div>
              </motion.div>
            ) : (
               <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                   <h2 className="text-3xl font-bold mb-4">Değerlendirme Sonucu ve Eylem Planı</h2>
                   <div className="space-y-4 max-w-xl mx-auto">
                     <p className="text-slate-200 text-lg leading-relaxed">
                       Yalnız değilsiniz. <span className="font-bold text-[#2dd4bf]">Beyanınız esastır.</span> Size en yakın güvenli destek merkezlerini aşağıda görebilir ve tek tıkla yardım alabilirsiniz.
                     </p>
                     <p className="text-xs text-slate-400 font-medium italic opacity-80">
                       6284 sayılı kanun kapsamında beyanınız temel alınarak koruma süreci başlatılabilir.
                     </p>
                   </div>
                </div>

                {/* Result screen mapped via Priority state */}
                {renderResult()}
                
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Note */}
      <div className="fixed bottom-0 left-0 right-0 p-6 text-center z-20 pointer-events-none">
        <p className="text-xs text-slate-400 font-medium opacity-80 flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          Bu bilgiler cihazınızda saklanmaz ve paylaşılan veriler şifrelidir.
        </p>
      </div>

      {/* Ambient glass blur elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-[#2dd4bf]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] bg-[#0ea5e9]/5 rounded-full blur-[100px]"></div>
      </div>
      </div>
    </SafeRender>
  );
}
