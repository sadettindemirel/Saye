import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, ZoomControl, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';
import Papa from 'papaparse';
import { 
  ArrowLeft, 
  MapPin, 
  TreePine,
  BookOpen,
  Library as LibraryIcon,
  X,
  Compass,
  Loader2,
  Navigation,
  Home,
  Download,
  Shield,
  Phone,
  UtensilsCrossed,
  Heart,
  Users
} from 'lucide-react';
import { SayeOlForm } from './SayeOlForm';

interface KidZone {
  id: string;
  name: string;
  address: string;
  category: string;
  lat: number;
  lng: number;
  description?: string;
  branches?: string;
  rating?: number;
  hours?: string; 
}

type KidCategory = "All" | "Play" | "Learning" | "Library" | "Social" | "Safety" | "Restaurant" | "Support";

interface Props {
  onBack: () => void;
}

// Leaflet Icons
const parkIconHtml = renderToString(<TreePine className="w-5 h-5 text-white" />);
const parkIcon = L.divIcon({
  html: `<div class="w-10 h-10 border-[3px] border-emerald-400 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-transform hover:scale-110 animate-marker-entrance">${parkIconHtml}</div>`,
  className: 'custom-leaflet-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const ismekIconHtml = renderToString(<BookOpen className="w-5 h-5 text-white" />);
const ismekIcon = L.divIcon({
  html: `<div class="w-10 h-10 border-[3px] border-purple-400 bg-purple-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.8)] transition-transform hover:scale-110 animate-marker-entrance">${ismekIconHtml}</div>`,
  className: 'custom-leaflet-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const libraryIconHtml = renderToString(<LibraryIcon className="w-5 h-5 text-white" />);
const libraryIcon = L.divIcon({
  html: `<div class="w-10 h-10 border-[3px] border-cyan-400 bg-cyan-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(8,145,178,0.8)] transition-transform hover:scale-110 animate-marker-entrance">${libraryIconHtml}</div>`,
  className: 'custom-leaflet-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const socialIconHtml = renderToString(<Heart className="w-5 h-5 text-white" fill="white" />);
const socialIcon = L.divIcon({
  html: `<div class="w-10 h-10 border-[3px] border-orange-400 bg-orange-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.8)] transition-transform hover:scale-110 animate-marker-entrance text-white">${socialIconHtml}</div>`,
  className: 'custom-leaflet-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const supportIconHtml = renderToString(<Users className="w-5 h-5 text-white" />);
const supportIcon = L.divIcon({
  html: `<div class="w-10 h-10 border-[3px] border-orange-300 bg-[#cd7f32] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(205,127,50,0.8)] transition-transform hover:scale-110 animate-marker-entrance text-white">${supportIconHtml}</div>`,
  className: 'custom-leaflet-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const restaurantIconHtml = renderToString(<UtensilsCrossed className="w-5 h-5 text-white" />);
const restaurantIcon = L.divIcon({
  html: `<div class="w-10 h-10 border-[3px] border-red-400 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.8)] transition-transform hover:scale-110 animate-marker-entrance text-white">${restaurantIconHtml}</div>`,
  className: 'custom-leaflet-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const shieldIconHtml = renderToString(<Shield className="w-5 h-5 text-white" />);
const shieldIcon = L.divIcon({
  html: `<div class="w-10 h-10 border-[3px] border-pink-400 bg-pink-600 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(219,39,119,0.9)] transition-transform hover:scale-110 animate-marker-entrance">${shieldIconHtml}</div>`,
  className: 'custom-leaflet-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const userIcon = L.divIcon({
  html: `<div class="relative flex items-center justify-center">
        <div class="absolute w-12 h-12 bg-blue-500 rounded-full animate-ping opacity-50"></div>
        <div class="relative w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
        <div class="absolute -bottom-6 whitespace-nowrap text-xs font-bold text-blue-400 drop-shadow-md">Siz Buradasınız</div>
     </div>`,
  className: 'user-location-icon',
  iconSize: [48, 48],
  iconAnchor: [24, 24]
});

// Listener component to handle Map Pan/Zoom (moveend) and trigger data fetching
function MapMoveController({ onMoveEnd }: { onMoveEnd: (center: {lat: number, lng: number}) => void }) {
  useMapEvents({
    moveend: (e) => {
      const center = e.target.getCenter();
      onMoveEnd({ lat: center.lat, lng: center.lng });
    }
  });
  return null;
}

// Component to smoothly fly back to user
function MapFlyTo({ location }: { location: {lat: number, lng: number} | null }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      // SADECE zoom seviyesi 15'ten küçükse zoom yap, aksi halde olan zoom'u koru, ama lokasyona merkezi kaydır
      const currentZoom = map.getZoom();
      const targetZoom = Math.max(15, currentZoom); 
      map.flyTo([location.lat, location.lng], targetZoom, { duration: 1.5 });
    }
  }, [location, map]);
  return null;
}

// Component to smoothly fly to selected zone
function SelectedZoneFlyTo({ zone }: { zone: KidZone | null }) {
  const map = useMap();
  useEffect(() => {
    if (zone) {
      map.flyTo([zone.lat, zone.lng], Math.max(map.getZoom(), 15), {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [zone, map]);
  return null;
}

// Fit bounds for safety centers
function SafetyBoundsController({ active, zones }: { active: boolean, zones: KidZone[] }) {
  const map = useMap();
  useEffect(() => {
    if (active && zones.length > 0) {
      const bounds = L.latLngBounds(zones.map(z => [z.lat, z.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [active, zones, map]);
  return null;
}

const HARDCODED_LIBRARY_COORDS: Record<string, {lat: number, lng: number}> = {"Kadın Eserleri Kütüphanesi_Fatih":{"lat":41.0307407,"lng":28.9504883},"Osman Nuri Ergin Kütüphanesi_Güngören":{"lat":41.0285491,"lng":28.8770823},"İdris Güllüce Kütüphanesi_Tuzla":{"lat":40.8500468,"lng":29.3031159},"Muallim Cevdet Kütüphanesi_Kartal":{"lat":40.886181,"lng":29.1966004},"Halil İnalcık Kütüphanesi_Kartal":{"lat":40.905902,"lng":29.1613794},"Sesli Kütüphane_Eyüpsultan":{"lat":41.0482431,"lng":28.9354595},"Erdem Bayazıt Kütüphanesi_Eyüpsultan":{"lat":41.178701,"lng":28.702508},"Metin And Kütüphanesi_K.Çekmece":{"lat":40.9979824,"lng":28.7927495},"Ahmet Kabaklı Kütüphanesi_Fatih":{"lat":41.0196101,"lng":28.9398749},"Rasim Özdenören Kütüphanesi_Başakşehir":{"lat":41.1045658,"lng":28.7854389},"Okçular Tekkesi Kütüphanesi_Beyoğlu":{"lat":41.0409795,"lng":28.9603068},"Fatma Aliye Kütüphanesi_Çekmeköy":{"lat":41.0531537,"lng":29.2380278},"İlhan Varank Kütüphanesi_Sultanbeyli":{"lat":41.0218054,"lng":28.894142},"Atatürk Müzesi Kütüphanesi_Şişli":{"lat":40.9783946,"lng":29.1251509},"Afife Batur Kütüphanesi_Kadıköy":{"lat":40.9970443,"lng":29.0437256},"Mecidiyeköy Ödünç Kütüphane_Şişli":{"lat":41.0665315,"lng":28.995647},"Sezai Karakoç Kütüphanesi_Güngören":{"lat":41.2153479,"lng":28.7455561},"Rıfat Ilgaz Kütüphanesi_Arnavutköy":{"lat":41.1793593,"lng":28.7460023},"Fakir Baykurt Kütüphanesi_Avcılar":{"lat":41.0312375,"lng":28.702602},"Özgen Berkol Doğan Kütüphanesi_Kadıköy":{"lat":40.9840957,"lng":29.0308119},"Kütüphane Troleybüs_Fatih":{"lat":41.0120472,"lng":28.9622045},"Evliya Çelebi Kütüphanesi_Bayrampaşa":{"lat":41.038943,"lng":28.8956236},"Gülten Akın Kütüphanesi_Esenyurt":{"lat":41.0339525,"lng":28.6513965},"Peyami Safa Kütüphanesi_Beyoğlu":{"lat":41.0334055,"lng":28.9694044},"Yaşar Kemal Kütüphanesi_Sancaktepe":{"lat":41.0132894,"lng":29.2064075},"Sabahattin Eyüboğlu Kütüphanesi_Avcılar":{"lat":41.0011771,"lng":28.7113098},"İPA İstanbul Kitaplığı_Bakırköy":{"lat":40.9747892,"lng":28.7871655},"Atilla İlhan Kütüphanesi_Küçükçekmece":{"lat":40.990127,"lng":28.7832456},"Moda İskelesi Kütüphanesi_Kadıköy":{"lat":40.9789898,"lng":29.0251042},"Hasan Hüseyin Korkmazgil Kütüphanesi_Eyüpsultan":{"lat":41.0829701,"lng":28.9281987},"Hasan İzzettin Dinamo Kütüphanesi_Pendik":{"lat":40.875952,"lng":29.2319759},"Sevgi Soysal Kütüphanesi_Beyoğlu":{"lat":41.0394435,"lng":28.9855591},"Cemil Meriç Kütüphanesi_Arnavutköy":{"lat":41.0189,"lng":28.688193},"Kara Surları Mevlanakapı Kütüphanesi_Fatih":{"lat":41.0146728,"lng":28.9220713},"Feza Gürsey Kütüphanesi_Beykoz":{"lat":41.0790958,"lng":29.0740307},"Sabahattin Ali Kütüphanesi_Başakşehir":{"lat":41.0681152,"lng":28.7529337},"İsmail Hakkı Tonguç Kütüphanesi_Esenyurt":{"lat":41.0334811,"lng":28.6827686},"Muzaffer İzgü Kütüphanesi_Maltepe":{"lat":40.9275656,"lng":29.156483},"Suat Derviş Kütüphanesi_Bayrampaşa":{"lat":41.0457831,"lng":28.902505},"Sâmiha Ayverdi Kütüphanesi_Bayrampaşa":{"lat":41.0728385,"lng":28.88711}};

const HARDCODED_SOCIAL_COORDS: Record<string, {lat: number, lng: number}> = {
  "FLORYA SOSYAL TESİSİ": { lat: 40.9669, lng: 28.7885 },
  "GAZİ SOSYAL TESİSİ": { lat: 41.1158, lng: 28.9092 },
  "GÖZDAĞI SOSYAL TESİSİ": { lat: 40.9014, lng: 29.2483 },
  "HALİÇ SOSYAL TESİSİ": { lat: 41.0312, lng: 28.9542 },
  "İSTİNYE SOSYAL TESİSİ": { lat: 41.1147, lng: 29.0558 },
  "KASIMPAŞA SOSYAL TESİSİ": { lat: 41.0315, lng: 28.9712 },
  "KÜÇÜK ÇAMLICA SOSYAL TESİSİ": { lat: 41.0225, lng: 29.0592 },
  "KÜÇÜKÇEKMECE SOSYAL TESİSİ": { lat: 40.9915, lng: 28.7758 },
  "SAFA TEPESİ SOSYAL TESİSİ": { lat: 41.0028, lng: 29.2315 },
  "AVCILAR SOSYAL TESİSİ": { lat: 40.9806, lng: 28.7176 },
  "BEYKOZ KORU SOSYAL TESİSİ": { lat: 41.1347, lng: 29.0885 },
  "BEYKOZ SAHİL SOSYAL TESİSİ": { lat: 41.1278, lng: 29.0912 },
  "BOĞAZKÖY SOSYAL TESİSİ": { lat: 41.0508, lng: 28.6952 },
  "ÇAMLICA SOSYAL TESİSİ": { lat: 41.0289, lng: 29.0664 },
  "CİHANGİR SOSYAL TESİSİ": { lat: 41.0328, lng: 28.9835 },
  "DRAGOS SOSYAL TESİSİ": { lat: 40.9045, lng: 29.1688 },
  "FETHİPAŞA SOSYAL TESİSİ": { lat: 41.0268, lng: 29.0212 },
  "SULTANBEYLİ SOSYAL TESİSİ": { lat: 40.9251, lng: 29.2669 },
  "YAKUPLU SOSYAL TESİSİ": { lat: 40.9898, lng: 28.6752 },
  "BEYKOZ KIR BAHÇESİ SOSYAL TESİSİ": { lat: 41.1341, lng: 29.0881 },
  "PEMBE KÖŞK SOSYAL TESİSİ": { lat: 41.1182, lng: 29.0718 },
  "KIR KAHVESİ SOSYAL TESİSİ": { lat: 41.1185, lng: 29.0722 },
  "PAŞALİMANI SOSYAL TESİSİ": { lat: 41.0262, lng: 29.0145 },
  "FLORYA YERLEŞİM BİRİMLERİ": { lat: 40.9672, lng: 28.7889 },
  "ZEYTİNBURNU SOSYAL TESİSİ": { lat: 40.9855, lng: 28.9052 },
  "1453 ÇIRPICI SOSYAL TESİSİ": { lat: 41.0012, lng: 28.8955 },
  "DENİZKÖŞK SOSYAL TESİSİ": { lat: 40.9782, lng: 28.7186 },
  "GÜNGÖREN SOSYAL TESİSİ": { lat: 41.0284, lng: 28.8773 }
};

export default function SayeKesif({ onBack }: Props) {
  // Varsayılan Merkez: Üsküdar
  const DEFAULT_CENTER = { lat: 41.0267, lng: 29.0167 };

  const [activeCategory, setActiveCategory] = useState<KidCategory>("All");
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [searchCenter, setSearchCenter] = useState<{lat: number; lng: number}>(DEFAULT_CENTER);
  
  const [parks, setParks] = useState<KidZone[]>([]);
  const [csvIsmeks, setCsvIsmeks] = useState<KidZone[]>([]);
  const [csvLibraries, setCsvLibraries] = useState<KidZone[]>([]);
  const [socials, setSocials] = useState<KidZone[]>([]);
  const [supportPoints, setSupportPoints] = useState<KidZone[]>([]);
  const [restaurants, setRestaurants] = useState<KidZone[]>([]);
  const [safetyCenters, setSafetyCenters] = useState<KidZone[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedZone, setSelectedZone] = useState<KidZone | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showSayeOlForm, setShowSayeOlForm] = useState(false);

  const lastFetchCenter = useRef<{lat: number; lng: number} | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Istanbul Bounding Box for strict filtering
  const IS_ISTANBUL = (lat: number, lng: number) => {
    return lat > 40.0 && lat < 42.0 && lng > 27.5 && lng < 30.5;
  };

  // 1. Geolocation Integration on Mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(coords);
          setSearchCenter(coords);
          setIsLocating(false);
        },
        (error) => {
          console.warn("Geolocation failed (Permission denied/Timeout). Defaulting to Üsküdar.", error);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setIsLocating(false);
    }
  }, []);

  // 2. Initial Fetch for Static CSV Data (ISMEK)
  useEffect(() => {
    const fetchIsmekCsv = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTY8ns8_wmpcwp_c63QwBK4rm3Um0E3fhMFH-ZHFj0j0KpZNgfiDJX6ZWnPaajL2Rd_eFukJAVGE0Bj/pub?output=csv');
        const csvText = await res.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = results.data
              .filter((row: any) => row['LATITUDE'] && row['LONGITUDE']) // Sadece geçerli koordinatı olanlar
              .map((row: any) => ({
                id: `ismek-csv-${Math.random()}`,
                name: row['MERKEZ ADI'],
                address: row['ADRES'] + (row['İLÇE'] ? `, ${row['İLÇE']} - İstanbul` : ''),
                category: 'Learning',
                lat: parseFloat(row['LATITUDE']),
                lng: parseFloat(row['LONGITUDE']),
                description: 'İstanbul Büyükşehir Belediyesi Enstitü İstanbul İSMEK Eğitim Merkezi.',
                branches: row['BRANŞLAR'] || ''
              }))
              .filter((zone: any) => !isNaN(zone.lat) && !isNaN(zone.lng) && IS_ISTANBUL(zone.lat, zone.lng));
              
            setCsvIsmeks(parsedData);
          }
        });
      } catch (err) {
        console.error("ISMEK CSV Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIsmekCsv();
  }, []); 

  // 3. Initial Fetch for Libraries CSV with Static Coordinates
  useEffect(() => {
    const fetchLibrariesCsv = async () => {
      try {
        const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vR7sCwfCKGZbVDTdVBIr0ZWcduVdMYMczMPQzDvS3BPLWcM2ShcRdbQyrQWcT3zvyNCdMYetJxZYKOS/pub?output=csv');
        const csvText = await res.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const rows = results.data;
            let libs: KidZone[] = [];
            
            for (let i = 0; i < rows.length; i++) {
               const row: any = rows[i];
               
               const libName = (row['Kütüphane Adı'] || row['Ad'] || 'İsimsiz Kütüphane').toString().trim();
               const districtName = (row['İlçe Adı'] || '').toString().trim();
               const address = row['Adres'] || districtName || 'İstanbul';
               
               if (!libName || libName === 'İsimsiz Kütüphane') continue;
               
               const parsedLat = parseFloat(row['Enlem'] || row['Latitude'] || row['LAT'] || row['lat']);
               const parsedLng = parseFloat(row['Boylam'] || row['Longitude'] || row['LNG'] || row['lng']);
                 
               if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
                   libs.push({
                      id: `lib-csv-${Math.random()}`,
                      name: libName, address, category: 'Library', lat: parsedLat, lng: parsedLng
                   });
                   continue;
               }

               const cacheKey = `${libName}_${districtName}`;
               if (HARDCODED_LIBRARY_COORDS[cacheKey]) {
                   libs.push({
                      id: `lib-csv-${Math.random()}`,
                      name: libName, address, category: 'Library', lat: HARDCODED_LIBRARY_COORDS[cacheKey].lat, lng: HARDCODED_LIBRARY_COORDS[cacheKey].lng
                   });
               }
            }

            setCsvLibraries(libs);
          }
        });
      } catch (err) {
        console.error("Library CSV Fetch Error:", err);
      }
    };

    fetchLibrariesCsv();
  }, []);  

  // 4. Initial Fetch for Social Facilities and Social Service Points
  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const urls = [
          'https://docs.google.com/spreadsheets/d/e/2PACX-1vQxkYZDoULfgV0-k1KJk9ELfeoqVHrqnoel9iqQSOheuAj1H8XyQs509Wuj_XdhY863MtmIvfSFkqnY/pub?output=csv',
          'https://docs.google.com/spreadsheets/d/e/2PACX-1vRBsSyznkfKGRpGAMpbaiNXL-N4pdeh7SZV4Rbq00xmpRQVf_FZ24pohNPX2V8wdovI5nmbQ8f-defm/pub?output=csv'
        ];

        const [res1, res2] = await Promise.all(urls.map(u => fetch(u)));
        const [csv1, csv2] = await Promise.all([res1.text(), res2.text()]);

        const parseCsv = (text: string, category: string) => {
          return new Promise<KidZone[]>((resolve) => {
            Papa.parse(text, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
                const items = results.data.map((row: any, i: number) => {
                  const name = (row['TESİS ADI'] || row['MERKEZ_ADI'] || row['Ad'] || row['ADI'] || row['Merkez Adı'] || '').trim();
                  const address = (row['ADRES'] || row['Adres'] || '').trim();
                  let lat = parseFloat(row['LATITUDE'] || row['Enlem'] || row['ENLEM'] || row['lat'] || row['Lat'] || row['Enlem (Lat)'] || 0);
                  let lng = parseFloat(row['LONGITUDE'] || row['Boylam'] || row['BOYLAM'] || row['lng'] || row['Long'] || row['Boylam (Long)'] || 0);

                  // Fallback to hardcoded coordinates if missing or zero (case-insensitive)
                  const upperName = name.toUpperCase();
                  if ((lat === 0 || lng === 0) && HARDCODED_SOCIAL_COORDS[upperName]) {
                    lat = HARDCODED_SOCIAL_COORDS[upperName].lat;
                    lng = HARDCODED_SOCIAL_COORDS[upperName].lng;
                  }

                  return { id: `${category}-${Math.random()}`, name, address, category, lat, lng };
                }).filter((z: any) => z.lat !== 0 && z.lng !== 0 && IS_ISTANBUL(z.lat, z.lng));
                resolve(items);
              }
            });
          });
        };

        const [items1, items2] = await Promise.all([
          parseCsv(csv1, 'Social'), 
          parseCsv(csv2, 'Support')
        ]);
        setSocials(items1);
        setSupportPoints(items2);
      } catch (err) {
        console.error("Social Fetch Error:", err);
      }
    };
    fetchSocials();
  }, []);

  // 5. Initial Fetch for Kent Lokantaları
  useEffect(() => {
    const fetchRestaurants = async () => {
       const kentLokantalari: KidZone[] = [
          { id: 'kl-1', name: 'Çapa Kent Lokantası', address: 'Molla Gürani Mah. Turgut Özal Cad. No: 107 Fatih', category: 'Restaurant', lat: 41.0152, lng: 28.9392 },
          { id: 'kl-2', name: 'Bağcılar Kent Lokantası', address: 'Yavuz Selim Mah. 26/3. Sok. No: 2 Bağcılar', category: 'Restaurant', lat: 41.0345, lng: 28.8567 },
          { id: 'kl-3', name: 'Sultanbeyli Kent Lokantası', address: 'Mehmet Akif Mah. Fatih Bulvarı No: 153 Sultanbeyli', category: 'Restaurant', lat: 40.9251, lng: 29.2669 },
          { id: 'kl-4', name: 'Üsküdar Kent Lokantası', address: 'Mimar Sinan Mah. Çavuşdere Cad. No: 35 Üsküdar', category: 'Restaurant', lat: 41.0252, lng: 29.0175 },
          { id: 'kl-5', name: 'Avcılar Kent Lokantası', address: 'Merkez Mah. Marmara Cad. No: 13 Avcılar', category: 'Restaurant', lat: 40.9806, lng: 28.7176 },
          { id: 'kl-6', name: 'Sultanahmet Kent Lokantası', address: 'Divanyolu Cad. No: 56 Fatih', category: 'Restaurant', lat: 41.0085, lng: 28.9744 },
          { id: 'kl-7', name: 'Küçükçekmece Kent Lokantası', address: 'Kartaltepe Mah. Belediye Cad. No: 8 K.Çekmece', category: 'Restaurant', lat: 40.9912, lng: 28.7958 },
          { id: 'kl-8', name: 'Hisarüstü Kent Lokantası', address: 'Rumeli Hisarı Mah. Nispetiye Cad. No: 120 Sarıyer', category: 'Restaurant', lat: 41.0855, lng: 29.0522 }
       ];
       setRestaurants(kentLokantalari);
    };
    fetchRestaurants();
  }, []);

  // 4.5 Fetching Safety Centers (Güvenli Kalkan) - Direct Coordinates
  useEffect(() => {
    const fetchSafetyCsv = async () => {
      try {
        const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQiPw3Q3_bumUBOzj3q_dMuQwBgHXd4L3w9aV40-5hS0Yr4lT1Bfw2qcyU59OVkACo0mpkuFqN19Drg/pub?output=csv');
        const csvText = await res.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const safetyItems: KidZone[] = results.data.map((row: any, i: number) => {
              // Case-insensitive column finding
              const findVal = (keys: string[]) => {
                const foundKey = Object.keys(row).find(k => {
                  const cleanedKey = k.replace(/^\ufeff/, '').trim().toUpperCase();
                  return keys.includes(cleanedKey);
                });
                return foundKey ? row[foundKey] : null;
              };

              const name = (findVal(['MERKEZ_ADI', 'ADI', 'AD', 'NAME', 'MERKEZ ADI']) || 'Kadın Danışma Merkezi').trim();
              const address = (findVal(['ADRES', 'ADDRESS', 'MERKEZ ADRESI']) || '').trim();
              const lat = parseFloat(findVal(['LATITUDE', 'ENLEM', 'LAT', 'LAT (ENLEM)', 'ENLEM (LAT)']) || 0);
              const lng = parseFloat(findVal(['LONGITUDE', 'BOYLAM', 'LNG', 'LONG', 'BOYLAM (LONG)', 'LONG (BOYLAM)']) || 0);
              
              return {
                id: `safety-${i}`,
                name,
                address,
                category: 'Safety',
                lat,
                lng
              };
            }).filter((z: any) => z.lat !== 0 && z.lng !== 0);
            
            setSafetyCenters(safetyItems);
          }
        });
      } catch (err) {
        console.error("Safety CSV Fetch Error:", err);
      }
    };
    fetchSafetyCsv();
  }, []);

  // 5. Dynamic Fetching using Overpass API (For Parks only)
  useEffect(() => {
    let isMounted = true;

    const fetchZones = async () => {
      if (activeCategory === "Learning" || activeCategory === "Library") return; 

      setIsLoading(true);
      lastFetchCenter.current = searchCenter;

      try {
        const res = await fetch(`/api/overpass?lat=${searchCenter.lat}&lng=${searchCenter.lng}&type=park`);
        if (res.ok && isMounted) {
          const data = await res.json();
          setParks((prev) => {
            const combined = [...prev, ...data].filter((zone: any) => !isNaN(zone.lat) && !isNaN(zone.lng) && IS_ISTANBUL(zone.lat, zone.lng));
            return Array.from(new Map(combined.map(z => [z.id, z])).values());
          });
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchZones();

    return () => { isMounted = false; };
  }, [searchCenter, activeCategory]);

  // Handler: Avoid spamming APis with Debounce logic
  const handleMapPan = useCallback((center: {lat: number; lng: number}) => {
    if (!lastFetchCenter.current) return;
    
    // Yalnızca belirli bir mesafe kat edildiyse tetikle
    const distSq = Math.pow(center.lat - lastFetchCenter.current.lat, 2) + Math.pow(center.lng - lastFetchCenter.current.lng, 2);
    if (distSq > 0.0002) { 
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        setSearchCenter(center);
      }, 1500);
    }
  }, []);

  // Cleanup leftovers
  const getCombinedZones = () => {
    let combined: KidZone[] = [];
    if (activeCategory === "All" || activeCategory === "Safety") combined = [...combined, ...safetyCenters];
    if (activeCategory === "All" || activeCategory === "Play") combined = [...combined, ...parks];
    if (activeCategory === "All" || activeCategory === "Learning") combined = [...combined, ...csvIsmeks];
    if (activeCategory === "All" || activeCategory === "Library") combined = [...combined, ...csvLibraries];
    if (activeCategory === "All" || activeCategory === "Social") combined = [...combined, ...socials];
    if (activeCategory === "All" || activeCategory === "Support") combined = [...combined, ...supportPoints];
    if (activeCategory === "All" || activeCategory === "Restaurant") combined = [...combined, ...restaurants];
    // Sadece geçerli koordinatları döndür
    return combined.filter(z => z.lat !== 0 && z.lng !== 0);
  };

  const zonesToDisplay = getCombinedZones();

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a] text-white font-sans flex flex-col selection:bg-teal-200 selection:text-slate-900">
      
      {/* HEADER : Intact Saye Aesthetic */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between shadow-sm z-20 shrink-0 gap-4">
         
         <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors text-slate-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
                onClick={() => setShowSayeOlForm(true)}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-full transition-colors text-white shadow-lg"
                title="Saye Ol - Gönüllü Ol"
             >
               <Heart className="w-5 h-5" />
             </button>
             <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 px-2 shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div className="relative group">
                 {isLoading && (
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                 )}
              </div>
            </div>
         </div>

         <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1 md:pb-0">
            <button 
              onClick={() => setActiveCategory("All")}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeCategory === "All" ? "bg-blue-500 text-white shadow-lg" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
            >
              Tümü
            </button>
            <button 
              onClick={() => setActiveCategory("Safety")}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeCategory === "Safety" ? "bg-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]" : "bg-slate-800 text-pink-400 hover:bg-slate-700"}`}
            >
              <Shield className="w-4 h-4" /> Kadın Merkezi
            </button>
            <button 
              onClick={() => setActiveCategory("Social")}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeCategory === "Social" ? "bg-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "bg-slate-800 text-orange-400 hover:bg-slate-700"}`}
            >
              <Heart className="w-4 h-4" /> Sosyal Tesisler
            </button>
            <button 
              onClick={() => setActiveCategory("Support")}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeCategory === "Support" ? "bg-[#cd7f32] text-white shadow-[0_0_15px_rgba(205,127,50,0.4)]" : "bg-slate-800 text-orange-300 hover:bg-slate-700"}`}
            >
              <Users className="w-4 h-4" /> Sosyal Hizmetler
            </button>
            <button 
              onClick={() => setActiveCategory("Restaurant")}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeCategory === "Restaurant" ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]" : "bg-slate-800 text-red-400 hover:bg-slate-700"}`}
            >
              <UtensilsCrossed className="w-4 h-4" /> Kent Lokantaları
            </button>
            <button 
              onClick={() => setActiveCategory("Learning")}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeCategory === "Learning" ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]" : "bg-slate-800 text-purple-400 hover:bg-slate-700"}`}
            >
              <BookOpen className="w-4 h-4" /> Eğitim (İSMEK)
            </button>
            <button 
              onClick={() => setActiveCategory("Library")}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeCategory === "Library" ? "bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)]" : "bg-slate-800 text-cyan-400 hover:bg-slate-700"}`}
            >
              <LibraryIcon className="w-4 h-4" /> Kütüphaneler
            </button>
            <button 
               onClick={() => setActiveCategory("Play")}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeCategory === "Play" ? "bg-emerald-500 text-white shadow-lg" : "bg-slate-800 text-emerald-400 hover:bg-slate-700"}`}
            >
              <TreePine className="w-4 h-4" /> Parklar
            </button>
         </div>

      </div>

      {/* BODY : Map and Overlay */}
      <div className="flex-1 overflow-hidden relative bg-[#0f172a]">
        
        <AnimatePresence>
          {showSayeOlForm && <SayeOlForm onClose={() => setShowSayeOlForm(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {showOnboarding && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md px-4"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-[90%] max-w-xl bg-slate-900 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide"
              >
                <div className="mb-6 flex justify-center">
                   <div className="w-20 h-20 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Compass className="w-10 h-10" />
                   </div>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">Saye Keşif'e Hoş Geldiniz</h2>
                
                <p className="text-slate-300 text-sm md:text-base text-center mb-8 leading-relaxed">
                  Saye Keşif, İstanbul’daki diaspora kadınları ve çocukları için güvenli, erişilebilir ve kültürel olarak kapsayıcı mekanları keşfetmeyi kolaylaştıran dijital bir rehberdir. Amacımız, dil ve kültür bariyerlerini aşarak şehrin sunduğu sosyal ve eğitsel olanaklara güvenle uyum sağlamanıza yardımcı olmaktır.
                </p>

                <div className="space-y-5 mb-8">
                   <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                         <Shield className="w-5 h-5" />
                      </div>
                      <div>
                         <h3 className="text-white font-bold text-sm">Güvenli Kalkan</h3>
                         <p className="text-slate-400 text-xs mt-1">İBB Kadın Danışma Merkezleri ve güvenli destek noktaları.</p>
                      </div>
                   </div>

                   <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                         <Home className="w-5 h-5" />
                      </div>
                      <div>
                         <h3 className="text-white font-bold text-sm">Sosyal Tesisler</h3>
                         <p className="text-slate-400 text-xs mt-1">Uygun fiyatlı ve güvenli sosyal tesisleri, dinlenme alanlarını keşfedin.</p>
                      </div>
                   </div>
                   
                   <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                         <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                         <h3 className="text-white font-bold text-sm">Eğitim (İSMEK)</h3>
                         <p className="text-slate-400 text-xs mt-1">İstanbul'un sanat ve meslek eğitimi merkezlerini keşfedin.</p>
                      </div>
                   </div>
                   
                   <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                         <LibraryIcon className="w-5 h-5" />
                      </div>
                      <div>
                         <h3 className="text-white font-bold text-sm">Kütüphaneler</h3>
                         <p className="text-slate-400 text-xs mt-1">Sessiz çalışma alanları ve kültürel kaynaklara ulaşın.</p>
                      </div>
                   </div>
                   
                   <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                         <TreePine className="w-5 h-5" />
                      </div>
                      <div>
                         <h3 className="text-white font-bold text-sm">Parklar</h3>
                         <p className="text-slate-400 text-xs mt-1">Şehrin nefes alan yeşil alanlarını ve dinlenme noktalarını bulun.</p>
                      </div>
                   </div>
                </div>
                
                <button 
                  onClick={() => setShowOnboarding(false)}
                  className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/30"
                >
                   Keşfetmeye Başla
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLocating && (
           <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#0f172a]">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
              <p className="text-slate-400 font-medium">Bölgeniz tespit ediliyor...</p>
           </div>
        )}

        <MapContainer
          center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
          zoom={15}
          zoomControl={false}
          style={{ width: '100%', height: '100%', background: '#0f172a' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          />
          <ZoomControl position="topright" />
          
          <MapFlyTo location={userLocation} />
          <SelectedZoneFlyTo zone={selectedZone} />
          <SafetyBoundsController active={activeCategory === "Safety"} zones={safetyCenters} />
          <MapMoveController onMoveEnd={handleMapPan} />

          {userLocation && (
            <Marker position={userLocation} icon={userIcon} />
          )}

          {zonesToDisplay.map((zone) => {
            let iconToRender = parkIcon;
            if (zone.category === 'Learning') iconToRender = ismekIcon;
            else if (zone.category === 'Library') iconToRender = libraryIcon;
            else if (zone.category === 'Social') iconToRender = socialIcon;
            else if (zone.category === 'Support') iconToRender = supportIcon;
            else if (zone.category === 'Safety') iconToRender = shieldIcon;
            else if (zone.category === 'Restaurant') iconToRender = restaurantIcon;

            return (
              <Marker 
                key={zone.id}
                position={{ lat: zone.lat, lng: zone.lng }}
                icon={iconToRender}
                eventHandlers={{
                  click: () => setSelectedZone(zone)
                }}
              />
            )
          })}
        </MapContainer>

        {/* BOTTOM SHEET / INFO CARD : Glassmorphism */}
        <AnimatePresence>
          {selectedZone && (
             <motion.div 
             initial={{ opacity: 0, y: 50, scale: 0.95 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: 50, scale: 0.95 }}
             className="absolute bottom-6 left-4 right-4 md:left-auto md:right-8 max-w-[calc(100%-2rem)] md:max-w-md bg-slate-900/90 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col z-[9999] rounded-[32px] overflow-hidden max-h-[70vh]"
           >
              <div className="w-full flex justify-center py-3 cursor-pointer" onClick={() => setSelectedZone(null)}>
                 <div className="w-12 h-1 bg-white/20 rounded-full"></div>
              </div>

              <div className="p-6 pt-0 flex flex-col flex-1 overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                   {selectedZone.category === "Learning" ? (
                      <div className="p-3 bg-purple-500 rounded-2xl shadow-lg shadow-purple-500/20 text-white">
                         <BookOpen className="w-6 h-6" />
                      </div>
                   ) : selectedZone.category === "Library" ? (
                      <div className="p-3 bg-cyan-600 rounded-2xl shadow-lg shadow-cyan-500/20 text-white">
                         <LibraryIcon className="w-6 h-6" />
                      </div>
                   ) : selectedZone.category === "Social" ? (
                      <div className="p-3 bg-orange-600 rounded-2xl shadow-lg shadow-orange-500/20 text-white">
                         <Heart className="w-6 h-6" fill="white" />
                      </div>
                   ) : selectedZone.category === "Restaurant" ? (
                      <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-500/20 text-white">
                         <UtensilsCrossed className="w-6 h-6" />
                      </div>
                   ) : selectedZone.category === "Support" ? (
                      <div className="p-3 bg-[#cd7f32] rounded-2xl shadow-lg shadow-orange-500/20 text-white">
                         <Users className="w-6 h-6" />
                      </div>
                   ) : selectedZone.category === "Safety" ? (
                      <div className="p-3 bg-pink-600 rounded-2xl shadow-lg shadow-pink-500/20 text-white">
                         <Shield className="w-6 h-6" />
                      </div>
                   ) : (
                      <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20 text-white">
                         <TreePine className="w-6 h-6" />
                      </div>
                   )}
                   <button onClick={() => setSelectedZone(null)} className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors group">
                     <X className="w-4 h-4 text-slate-300 group-hover:text-white" />
                   </button>
                </div>
                
                <div className="mb-3">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-lg text-xs font-bold uppercase tracking-wider ${
                    selectedZone.category === "Learning" 
                      ? "bg-purple-500/10 border-purple-500/20 text-purple-400" 
                      : selectedZone.category === "Library"
                      ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                      : selectedZone.category === "Social"
                      ? "bg-orange-500/10 border-orange-500/20 text-orange-400" 
                      : selectedZone.category === "Restaurant"
                      ? "bg-red-500/10 border-red-500/20 text-red-400"
                      : selectedZone.category === "Support"
                      ? "bg-[#cd7f32]/10 border-[#cd7f32]/20 text-orange-300"
                      : selectedZone.category === "Safety"
                      ? "bg-pink-500/10 border-pink-500/20 text-pink-400"
                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  }`}>
                    {selectedZone.category === "Learning" ? "Eğitim (İSMEK)" : 
                     selectedZone.category === "Library" ? "Kütüphane" : 
                     selectedZone.category === "Social" ? "Sosyal Tesis" : 
                     selectedZone.category === "Restaurant" ? "Kent Lokantası" :
                     selectedZone.category === "Support" ? "Sosyal Hizmet" :
                     selectedZone.category === "Safety" ? "Kadın Merkezi" : "Açık Alan / Park"}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{selectedZone.name}</h2>
                <div className="text-slate-400 text-sm mb-6 flex items-start gap-2">
                   <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${
                      selectedZone.category === "Learning" ? "text-purple-400" : 
                      selectedZone.category === "Library" ? "text-cyan-400" : 
                      selectedZone.category === "Social" ? "text-orange-400" : 
                      selectedZone.category === "Safety" ? "text-pink-400" : "text-emerald-400"
                   }`} />
                   <span>{selectedZone.address}</span>
                </div>

                {selectedZone.category === "Social" && (
                   <div className="mb-6 p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                      <p className="text-orange-400 text-sm italic">Uygun fiyatlı ve güvenli sosyal tesisleri, dinlenme alanlarını keşfedin.</p>
                   </div>
                )}

                {selectedZone.category === "Safety" && (
                   <div className="mb-6 p-4 bg-pink-500/5 border border-pink-500/10 rounded-2xl">
                      <p className="text-pink-400 text-sm italic">Kadın Merkezi: Şiddete karşı dayanışma ve destek noktası.</p>
                   </div>
                )}
                
                <div className="mt-auto w-full pb-2 flex flex-col gap-3">
                  {selectedZone.category === "Safety" && (
                     <a 
                       href="tel:4440093"
                       className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold border border-white/10 transition-all active:scale-[0.98] flex justify-center items-center gap-2 text-base"
                     >
                        <Phone className="w-5 h-5 text-pink-400" /> Hemen Ara (444 00 93)
                     </a>
                  )}
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedZone.lat},${selectedZone.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-4 text-slate-900 rounded-2xl font-bold transition-all active:scale-[0.98] flex justify-center items-center gap-2 text-base ${
                      selectedZone.category === "Learning"
                        ? "bg-purple-500 hover:bg-purple-400 shadow-lg shadow-purple-500/30"
                        : selectedZone.category === "Library"
                        ? "bg-cyan-500 hover:bg-cyan-400 shadow-lg shadow-cyan-500/30"
                        : selectedZone.category === "Social"
                        ? "bg-orange-500 hover:bg-orange-400 shadow-lg shadow-orange-500/30"
                        : selectedZone.category === "Safety"
                        ? "bg-pink-600 hover:bg-pink-500 shadow-lg shadow-pink-500/30"
                        : "bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/30"
                    }`}
                  >
                     <Navigation className="w-5 h-5" /> Yol Tarifi Al
                  </a>
                </div>
              </div>
           </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </div>
  );
}
