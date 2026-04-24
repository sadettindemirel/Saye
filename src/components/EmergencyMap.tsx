import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';
import { renderToString } from 'react-dom/server';
import { Shield, MapPin, Navigation, Phone, HandHeart } from 'lucide-react';

interface Center {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance?: number;
  type: 'woman' | 'social';
}

const SOURCES = [
  {
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQiPw3Q3_bumUBOzj3q_dMuQwBgHXd4L3w9aV40-5hS0Yr4lT1Bfw2qcyU59OVkACo0mpkuFqN19Drg/pub?output=csv',
    type: 'woman' as const
  },
  {
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRBsSyznkfKGRpGAMpbaiNXL-N4pdeh7SZV4Rbq00xmpRQVf_FZ24pohNPX2V8wdovI5nmbQ8f-defm/pub?output=csv',
    type: 'social' as const
  }
];

const shieldIconHtml = renderToString(<Shield className="w-5 h-5 text-white" />);
const shieldIcon = L.divIcon({
  html: `<div class="w-10 h-10 border-[3px] border-white bg-pink-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,1)] animate-marker-entrance">${shieldIconHtml}</div>`,
  className: 'custom-leaflet-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const socialIconHtml = renderToString(<HandHeart className="w-5 h-5 text-white" />);
const socialIcon = L.divIcon({
  html: `<div class="w-10 h-10 border-[3px] border-white bg-orange-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.8)] animate-marker-entrance">${socialIconHtml}</div>`,
  className: 'social-leaflet-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const userIcon = L.divIcon({
  html: `<div class="relative flex items-center justify-center">
        <div class="absolute w-12 h-12 bg-blue-500 rounded-full animate-ping opacity-50"></div>
        <div class="relative w-4 h-4 bg-blue-500 border-2 border-white rounded-full"></div>
     </div>`,
  className: 'user-location-icon',
  iconSize: [48, 48],
  iconAnchor: [24, 24]
});

function MapController({ center, centers }: { center: [number, number], centers: Center[] }) {
  const map = useMap();
  useEffect(() => {
    if (centers.length > 0) {
      const bounds = L.latLngBounds([center, ...centers.map(c => [c.lat, c.lng] as [number, number])]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else {
      map.setView(center, 14);
    }
  }, [center, centers, map]);
  return null;
}

export default function EmergencyMap() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [userLoc, setUserLoc] = useState<[number, number]>([41.0082, 28.9784]); // Default Istanbul
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get User Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLoc(coords);
          fetchData(coords);
        },
        () => {
          fetchData([41.0082, 28.9784]);
        }
      );
    } else {
      fetchData([41.0082, 28.9784]);
    }
  }, []);

  const fetchData = async (currentLoc: [number, number]) => {
    try {
      const allResults: Center[] = [];
      
      const fetchPromises = SOURCES.map(async (source) => {
        const res = await fetch(source.url);
        const csvText = await res.text();
        
        return new Promise<void>((resolve) => {
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              const parsed = results.data.map((row: any, i: number) => {
                const lat = parseFloat(row['LATITUDE'] || row['ENLEM'] || row['lat'] || row['Enlem'] || row['Lat'] || row['Enlem (Lat)'] || 0);
                const lng = parseFloat(row['LONGITUDE'] || row['BOYLAM'] || row['lng'] || row['Boylam'] || row['Long'] || row['Boylam (Long)'] || 0);
                const name = (row['MERKEZ_ADI'] || row['ADI'] || row['Merkez Adı'] || row['ADI_SOYADI'] || 'Sosyal Hizmet Merkezi').trim();
                const address = (row['ADRES'] || row['Adres'] || '').trim();
                const dist = Math.sqrt(Math.pow(lat - currentLoc[0], 2) + Math.pow(lng - currentLoc[1], 2));
                
                return { id: `${source.type}-${i}`, name, address, lat, lng, distance: dist, type: source.type };
              }).filter((c: any) => c.lat !== 0 && !isNaN(c.lat));
              
              allResults.push(...parsed);
              resolve();
            }
          });
        });
      });

      await Promise.all(fetchPromises);

      const sortedCenters = allResults.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      console.log(`Toplam ${sortedCenters.length} adet güvenli nokta haritaya başarıyla eklendi.`);
      
      setCenters(sortedCenters);
      setLoading(false);
    } catch (err) {
      console.error("Emergency CSV Fetch Error:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="w-full h-[400px] bg-slate-800 animate-pulse rounded-3xl flex items-center justify-center text-slate-400">Merkezler Yükleniyor...</div>;
  }

  return (
    <div className="w-full h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-0">
      <MapContainer
        center={userLoc}
        zoom={14}
        zoomControl={false}
        style={{ width: '100%', height: '100%', background: '#0f172a' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        <MapController center={userLoc} centers={centers} />
        
        <Marker position={userLoc} icon={userIcon} zIndexOffset={4000} />

        {centers.map(center => (
          <Marker 
            key={center.id} 
            position={[center.lat, center.lng]} 
            icon={center.type === 'social' ? socialIcon : shieldIcon}
            zIndexOffset={3000}
            eventHandlers={{
              mouseover: (e) => {
                e.target.openPopup();
              },
              // Optional: Close on mouseout if you want it strictly tied to hover
              // mouseout: (e) => {
              //   e.target.closePopup();
              // }
            }}
          >
            <Popup className="emergency-popup" maxWidth={280}>
              <div className="p-2">
                {center.type === 'social' && (
                  <div className="mb-2 inline-flex items-center px-2 py-0.5 rounded-full bg-orange-100 text-[9px] font-bold text-orange-600 uppercase tracking-wider">
                    Sosyal Hizmet Noktası
                  </div>
                )}
                <h4 className="font-bold text-slate-900 mb-1 leading-tight">
                  {center.name.endsWith("Merkezi") ? center.name : `${center.name} Merkezi`}
                </h4>
                <p className="text-[11px] text-gray-600/80 mb-3 leading-relaxed italic">
                  {center.type === 'woman' 
                    ? "Bu merkez, şiddete maruz kalan veya risk altındaki kadınlara psikolojik destek, hukuksal danışmanlık ve sosyal hizmet sunan İBB'ye bağlı güvenli bir alandır."
                    : "Bu merkez, aile danışmanlığı, sosyal destek başvuruları ve koruyucu/önleyici hizmetler sunan resmi bir sosyal hizmet noktasıdır."
                  }
                </p>
                <div className="flex items-start gap-2 mb-4">
                  <MapPin className="w-3 h-3 mt-0.5 text-slate-400 shrink-0" />
                  <p className="text-[10px] text-slate-500">{center.address}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 bg-pink-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-pink-600/20 active:scale-95 transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Yol Tarifi
                  </a>
                  <a 
                    href={center.type === 'woman' ? "tel:4440093" : "tel:153"}
                    className="flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 active:scale-95 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" /> {center.type === 'woman' ? "444 00 93" : "153"} - Hemen Ara
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
