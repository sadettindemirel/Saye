import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Map,
  ShieldCheck,
  Bell,
  Store,
  X,
  Globe2,
  ChevronRight,
  MapPin,
  Coffee,
  Heart,
  Baby,
  Handshake,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import GuvenliKalkan from './components/GuvenliKalkan';
import SayeKesif from './components/SayeKesif';
import DayanismaAgi from './components/DayanismaAgi';
import { AboutModal } from './components/AboutModal';
import { LoginModal } from './components/LoginModal';
import { StorytellingModal } from './components/StorytellingModal';
import { SayeOlInfoModal } from './components/SayeOlInfoModal';
import { SayeOlForm } from './components/SayeOlForm';
import { FeatureSlider } from './components/FeatureSlider';


const translations = {
  tr: {
    title: "Dayanışmanın Şehirdeki Güvenli Gölgesi",
    subtitle: "İstanbul'daki diaspora kadınları ve çocukları için güvenli, ekonomik ve kültürel bir köprü.",
    exploreBtn: "Haritayı Keşfet",
    sayeBtn: "Saye Ol",
    modalText: "Bu özellik yakında hazır olacak - Prototip aşamasındayız",
    modalClose: "Kapat",
    cards: [
      {
        id: "kids",
        title: "Çocuk Dostu Alanlar",
        desc: "Çocuklar için onaylanmış oyun parkları, klinik ve etkinlik noktaları.",
        icon: Baby,
        badge: null,
        link: "#kids"
      },
      {
        id: "safety",
        title: "Güvenli Kalkan",
        desc: "Şiddet testi, acil durum rotaları ve tek tuşla destek ağlarına ulaşım.",
        icon: ShieldCheck,
        badge: "Aktif Koruma",
        link: "#safety"
      },
      {
        id: "alert",
        title: "Topluluk Yardımı",
        desc: "Anlık yardımlaşma ve yerel bildirimler.",
        icon: Bell,
        badge: null,
        link: "/map?filter=alert"
      },
      {
        id: "empowerment",
        title: "Ekonomik Güçlendirme",
        desc: "Kadın kooperatifleri, zanaatkar atölyeleri ve yerel girişimler için interaktif harita desteği.",
        icon: Store,
        badge: "Yakında",
        link: "#"
      }
    ]
  },
  en: {
    title: "The Safe Shadow of Solidarity in the City",
    subtitle: "A safe, economic, and cultural bridge for diaspora women and children in Istanbul.",
    exploreBtn: "Explore the Map",
    sayeBtn: "Become a Saye",
    modalText: "This feature will be ready soon - We are in the prototype phase",
    modalClose: "Close",
    cards: [
      {
        id: "kids",
        title: "Kid-friendly Zones",
        desc: "Verified playgrounds, clinics, and activity centers for children.",
        icon: Baby,
        badge: null,
        link: "#kids"
      },
      {
        id: "safety",
        title: "Safety Shield",
        desc: "Violence risk test, emergency routes, and one-click support access.",
        icon: ShieldCheck,
        badge: "Active Guard",
        link: "#safety"
      },
      {
        id: "alert",
        title: "Community Help",
        desc: "Instant mutual aid and local SOS alerts.",
        icon: Bell,
        badge: null,
        link: "/map?filter=alert"
      },
      {
        id: "empowerment",
        title: "Economic Empowerment",
        desc: "Interactive map support for women's cooperatives, artisan workshops, and local startups.",
        icon: Store,
        badge: "Coming Soon",
        link: "#"
      }
    ]
  }
};

const BlurryMapPreview = () => (
  <>
    <div className="absolute inset-0 bg-slate-200 blur-sm flex items-center justify-center">
      <div className="grid grid-cols-4 gap-2">
        <div className="w-4 h-4 bg-teal-400 rounded-full opacity-50"></div>
        <div className="w-4 h-4 bg-teal-400 rounded-full opacity-50"></div>
        <div className="w-4 h-4 bg-teal-400 rounded-full opacity-50"></div>
        <div className="w-4 h-4 bg-teal-400 rounded-full opacity-50"></div>
      </div>
    </div>
    <div className="absolute top-1/4 left-1/4 animate-bounce">
      <MapPin className="text-[#2dd4bf] w-5 h-5 drop-shadow-md" />
    </div>
    <div className="absolute top-1/2 right-1/3 animate-pulse">
      <Coffee className="text-teal-600 w-4 h-4 drop-shadow-md" />
    </div>
    <div className="absolute inset-0 flex items-center justify-center bg-indigo-900/10 backdrop-blur-[2px]">
      <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest opacity-60">Preview Mode</span>
    </div>
  </>
);

export default function App() {
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSayeOlForm, setShowSayeOlForm] = useState(false);
  const [isSayeOlInfoModalOpen, setIsSayeOlInfoModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'safety' | 'explore' | 'dayanisma'>('home');
  const t = translations[lang];

  // Intercept links to safety page
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#safety') {
        setActiveView('safety');
      } else if (window.location.hash === '#explore') {
        setActiveView('explore');
      } else if (window.location.hash === '#dayanisma') {
        setActiveView('dayanisma');
      } else {
        setActiveView('home');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (activeView === 'safety') {
    return <GuvenliKalkan onBack={() => { window.location.hash = ''; setActiveView('home'); }} />;
  }
  if (activeView === 'explore') {
    return <SayeKesif onBack={() => { window.location.hash = ''; setActiveView('home'); }} />;
  }
  if (activeView === 'dayanisma') {
    return <DayanismaAgi onBack={() => { window.location.hash = ''; setActiveView('home'); }} lang={lang} isDarkMode={isDarkMode} />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} font-sans antialiased overflow-hidden select-none selection:bg-teal-200 selection:text-slate-900`}>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-24 -left-24 w-96 h-96 ${isDarkMode ? 'bg-teal-900/20' : 'bg-teal-200/30'} rounded-full blur-3xl`}></div>
        <div className={`absolute top-1/2 -right-24 w-80 h-80 ${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-200/20'} rounded-full blur-3xl`}></div>
      </div>

      {/* Navbar */}
      <motion.nav 
        id="nav-bar"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6"
      >
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
             <Heart fill="currentColor" className="w-4 h-4 text-teal-500" />
          </div>
          <span className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} italic`}>Saye</span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <button 
                onClick={() => window.location.href = 'https://www.accuweather.com'}
                className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all flex items-center gap-2"
                title={lang === 'tr' ? 'Sizi anında güvenli bir siteye yönlendirir' : 'Redirects you to a safe site instantly'}
          >
              <LogOut className="w-4 h-4" />
              <span>{lang === 'tr' ? 'Hızlı Çıkış' : 'Quick Exit'}</span>
          </button>
          <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-200 text-slate-600'}`}
          >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className={`flex ${isDarkMode ? 'bg-slate-800' : 'bg-white/50'} backdrop-blur-md border ${isDarkMode ? 'border-slate-700' : 'border-white/40'} p-1 rounded-full shadow-sm`}>
            <button 
              onClick={() => setLang('tr')}
              className={`px-3 md:px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${lang === 'tr' ? (isDarkMode ? 'bg-slate-700 text-white' : 'bg-white text-slate-900') : (isDarkMode ? 'text-slate-400' : 'text-slate-400 hover:text-slate-600')}`}
            >
              TR
            </button>
            <button 
              onClick={() => setLang('en')}
              className={`px-3 md:px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${lang === 'en' ? (isDarkMode ? 'bg-slate-700 text-white' : 'bg-white text-slate-900') : (isDarkMode ? 'text-slate-400' : 'text-slate-400 hover:text-slate-600')}`}
            >
              EN
            </button>
          </div>
          <span onClick={() => setIsAboutModalOpen(true)} className={`hidden md:block text-sm font-medium ${isDarkMode ? 'text-slate-300 hover:text-teal-400' : 'text-slate-900 hover:text-teal-600'} transition-colors cursor-pointer`}>
            {lang === 'tr' ? 'Hakkımızda' : 'About'}
          </span>
          <button onClick={() => setIsLoginModalOpen(true)} className={`px-5 py-2.5 ${isDarkMode ? 'bg-teal-600 text-white' : 'bg-slate-900 text-white'} rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all`}>
            {lang === 'tr' ? 'Giriş Yap' : 'Login'}
          </button>
        </div>
      </motion.nav>

      {/* Main Content Container */}
      <main className="relative z-10 px-6 md:px-12 pt-8 pb-32 max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-100px)]">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 md:mb-12 max-w-3xl"
        >
          <h1 className={`text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'tr' ? 'Saye: ' : 'Saye: '}<span className="text-teal-500">{t.title}</span>
          </h1>
          <div className="flex flex-col gap-2">
            <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed max-w-2xl">
              {t.subtitle}
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => {
                window.location.hash = 'explore';
                setActiveView('explore');
              }}
              className="px-8 py-4 bg-teal-500 text-white rounded-2xl font-bold shadow-lg shadow-teal-200 hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-3 w-full sm:w-auto"
            >
              <Map className="w-5 h-5" />
              {t.exploreBtn}
            </button>
            <button 
              onClick={() => setIsSayeOlInfoModalOpen(true)}
              className="px-8 py-4 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl font-semibold shadow-sm hover:bg-white transition-all w-full sm:w-auto text-slate-800"
            >
              {t.sayeBtn}
            </button>
          </div>
        </motion.div>

        {/* Bento Grid Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-5 flex-grow"
        >
          
          {/* Button 1: Kids */}
          <div
            onClick={() => {
              window.location.hash = 'explore';
              setActiveView('explore');
              window.scrollTo(0, 0);
            }}
            className={`md:col-span-1 md:row-span-2 group relative overflow-hidden ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white/60 border-white'} backdrop-blur-md border rounded-[32px] p-8 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all cursor-pointer`}
          >
            <div className={`w-14 h-14 ${isDarkMode ? 'bg-teal-900/50' : 'bg-teal-100/50'} rounded-2xl flex items-center justify-center ${isDarkMode ? 'text-teal-400' : 'text-teal-600'} mb-6 md:mb-0`}>
              <Baby className="w-7 h-7" />
            </div>
            <div className="relative z-10 mt-auto">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>{t.cards[0].title}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} leading-snug`}>{t.cards[0].desc}</p>
            </div>
            <div className="absolute bottom-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
               <Baby strokeWidth={1} width={120} height={120} className="-mr-8 -mb-8" />
            </div>
          </div>

          {/* Button 2: Safety Shield */}
          <div
            onClick={() => {
              window.location.hash = 'safety';
              setActiveView('safety');
              window.scrollTo(0, 0);
            }}
            className={`md:col-span-2 md:row-span-1 group ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-900'} rounded-[32px] p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform gap-6`}
          >
            <div className="max-w-xs flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-2 py-0.5 ${isDarkMode ? 'bg-teal-700 text-teal-100' : 'bg-teal-400 text-slate-900'} text-[10px] items-center whitespace-nowrap font-bold uppercase tracking-wider rounded-md`}>
                  {t.cards[1].badge}
                </span>
                <h3 className="text-2xl font-bold text-white whitespace-nowrap">{t.cards[1].title}</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t.cards[1].desc}
              </p>
            </div>
            <div className="flex items-center justify-center sm:justify-end shrink-0">
               <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full flex items-center justify-center border border-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-teal-400/20 blur-xl"></div>
                  <ShieldCheck className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={2} />
               </div>
            </div>
          </div>

          {/* Button 3: Community Alert */}
          <div
            onClick={() => {
              window.location.hash = 'dayanisma';
              setActiveView('dayanisma');
              window.scrollTo(0, 0);
            }}
            className={`md:col-span-1 md:row-span-1 group ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white/60 border-white'} backdrop-blur-md border rounded-[32px] p-8 shadow-sm flex flex-col justify-between hover:bg-slate-800/80 transition-all cursor-pointer min-h-[200px]`}
          >
            <div className="flex justify-between items-start mb-6 md:mb-0">
               <div className={`w-12 h-12 ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'} rounded-xl flex items-center justify-center ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                  <Bell className="w-6 h-6 animate-shake" />
               </div>
               <span className="text-xs text-slate-400 font-mono font-medium">#SOS</span>
            </div>
            <div className="mt-auto">
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-1`}>{t.cards[2].title}</h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} leading-relaxed`}>{t.cards[2].desc}</p>
            </div>
          </div>

          {/* Button 4: Economic (The Core) */}
          <div
            onClick={() => setIsStoryModalOpen(true)}
            className={`md:col-span-3 md:row-span-1 group relative overflow-hidden ${isDarkMode ? 'bg-indigo-950/50 border-indigo-900' : 'bg-indigo-50/50 border-indigo-100'} backdrop-blur-md border rounded-[32px] p-8 shadow-sm cursor-help hover:shadow-md transition-all`}
          >
             <div className={`absolute top-6 right-6 w-12 h-12 ${isDarkMode ? 'bg-indigo-900/50 border-indigo-800 text-indigo-400' : 'bg-white/50 border-white/50 text-indigo-500'} backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse`}>
                <Handshake className="w-6 h-6" />
             </div>
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 h-full">
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.cards[3].title}</h3>
                  <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full">
                    {t.cards[3].badge}
                  </span>
                </div>
                <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} text-base leading-relaxed mb-4`}>{t.cards[3].desc}</p>
                <div className="flex flex-wrap gap-2">
                  <div className={`px-3 py-1 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-lg text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>#ElEmeği</div>
                  <div className={`px-3 py-1 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-lg text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>#Atölyeler</div>
                  <div className={`px-3 py-1 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-lg text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>#Startup</div>
                </div>
              </div>
              <div className="w-full sm:w-48 h-48 sm:h-full bg-white/40 rounded-2xl overflow-hidden border border-white/50 relative shrink-0">
                 <BlurryMapPreview />
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <div className="px-6 md:px-12 mb-8">
        <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-3`}>
          <span className="w-2 h-8 bg-teal-500 rounded-full inline-block"></span>
          {lang === 'tr' ? 'Sizlere Neler Sunuyoruz?' : 'What We Offer'}
        </h2>
      </div>
      <FeatureSlider id="feature-slider" isDarkMode={isDarkMode} />

      {/* Mobile Floating Exit Button */}
      <button 
          onClick={() => window.location.href = 'https://www.accuweather.com'}
          className="md:hidden fixed bottom-6 right-6 z-[100] px-4 py-3 bg-red-600 text-white rounded-full text-sm font-bold shadow-2xl shadow-red-500/50 hover:bg-red-700 transition-all flex items-center gap-2"
          title={lang === 'tr' ? 'Sizi anında güvenli bir siteye yönlendirir' : 'Redirects you to a safe site instantly'}
      >
          <LogOut className="w-4 h-4" />
      </button>

      {/* Saye Ol Form Modal */}
      <AnimatePresence>
        {isAboutModalOpen && <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} lang={lang} />}
        {isLoginModalOpen && <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} lang={lang} />}
        {isStoryModalOpen && <StorytellingModal isOpen={isStoryModalOpen} onClose={() => setIsStoryModalOpen(false)} lang={lang} />}
        {isSayeOlInfoModalOpen && <SayeOlInfoModal isOpen={isSayeOlInfoModalOpen} onClose={() => setIsSayeOlInfoModalOpen(false)} onConfirm={() => { setIsSayeOlInfoModalOpen(false); setShowSayeOlForm(true); }} isDarkMode={isDarkMode} lang={lang} />}
        {showSayeOlForm && <SayeOlForm onClose={() => setShowSayeOlForm(false)} />}
      </AnimatePresence>
    </div>
  );
}

