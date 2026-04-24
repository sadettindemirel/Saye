import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { ISTANBUL_CENTERS } from '../data/centers';

const containerStyle = {
  width: '100%',
  height: '350px'
};

// Center of Istanbul
const defaultCenter = {
  lat: 41.0082,
  lng: 28.9784
};

const libraries: "places"[] = ["places"];

export default function MapWidget() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral>(defaultCenter);
  const [policeStations, setPoliceStations] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<any>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  // Fetch User Location and find Police
  useEffect(() => {
    if (navigator.geolocation && isLoaded && map) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);

        const service = new window.google.maps.places.PlacesService(map);
        const request = {
          location: coords,
          radius: 5000, // 5km search
          type: 'police'
        };

        service.nearbySearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            setPoliceStations(results);
          }
        });
      }, () => {
         // Denied geolocation
         console.log("Geolocation denied, using default Istanbul center.");
      });
    }
  }, [isLoaded, map]);

  if (!isLoaded) {
    return <div className="w-full h-[350px] bg-slate-800 animate-pulse rounded-2xl flex items-center justify-center text-slate-400">Harita Yükleniyor...</div>;
  }

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      return (
        <div className="w-full p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
           <h3 className="text-red-400 font-bold mb-2">Google Maps API Key Eksik</h3>
           <p className="text-sm text-slate-300">Haritayı göstermek ve yakındaki polis karakollarını bulmak için .env dosyasına VITE_GOOGLE_MAPS_API_KEY ekleyin.</p>
        </div>
      );
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-white/10 relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
           styles: [
              { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
              {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
              },
              {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#38414e" }],
              },
              {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#212a37" }],
              },
              {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#746855" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }],
              },
           ],
           disableDefaultUI: true,
           zoomControl: true,
        }}
      >
        {/* User Location Marker */}
        <Marker 
           position={userLocation} 
           icon={{
             path: window.google.maps.SymbolPath.CIRCLE,
             scale: 8,
             fillColor: "#4285F4",
             fillOpacity: 1,
             strokeColor: "white",
             strokeWeight: 2,
           }}
        />

        {/* Police Stations (Dynamic) */}
        {policeStations.map((station) => (
          <Marker
            key={station.place_id}
            position={station.geometry?.location as google.maps.LatLng}
            icon={{
               path: window.google.maps.SymbolPath.CIRCLE,
               scale: 7,
               fillColor: "#2dd4bf", 
               fillOpacity: 1,
               strokeColor: "#0f172a",
               strokeWeight: 2,
            }}
            onClick={() => { setSelectedPlace(station); setSelectedCenter(null); }}
          />
        ))}

        {/* ŞÖNİM and SHM Data (Static) */}
        {ISTANBUL_CENTERS.map((center) => (
           <Marker
            key={center.id}
            position={{ lat: center.lat, lng: center.lng }}
            icon={{
               path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
               scale: 6,
               fillColor: "#e9d5ff",
               fillOpacity: 1,
               strokeColor: "#0f172a",
               strokeWeight: 2,
            }}
            onClick={() => { setSelectedCenter(center); setSelectedPlace(null); }}
           />
        ))}

        {/* Info Window for Police Station */}
        {selectedPlace && (
           <InfoWindow
             position={selectedPlace.geometry?.location}
             onCloseClick={() => setSelectedPlace(null)}
           >
              <div className="p-2 text-slate-900 max-w-xs">
                 <h4 className="font-bold text-sm mb-1">{selectedPlace.name}</h4>
                 <p className="text-xs mb-2">{selectedPlace.vicinity}</p>
              </div>
           </InfoWindow>
        )}

        {/* Info Window for Centers */}
        {selectedCenter && (
           <InfoWindow
             position={{ lat: selectedCenter.lat, lng: selectedCenter.lng }}
             onCloseClick={() => setSelectedCenter(null)}
           >
              <div className="p-2 text-slate-900 max-w-xs">
                 <div className="inline-block px-2 py-0.5 mb-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-sm">
                   {selectedCenter.category}
                 </div>
                 <h4 className="font-bold text-sm mb-1">{selectedCenter.name}</h4>
                 <p className="text-xs mb-2">{selectedCenter.address}</p>
                 <a href={selectedCenter.telLink} className="text-teal-600 font-bold text-sm block">
                   {selectedCenter.phone}
                 </a>
              </div>
           </InfoWindow>
        )}
      </GoogleMap>

      <div className="absolute bottom-4 left-4 bg-[#0f172a]/80 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs flex flex-col gap-2 pointer-events-none">
         <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#4285F4] border border-white block"></span> <span>Konumunuz</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2dd4bf] border border-[#0f172a] block"></span> <span>Polis (Yakındaki)</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#e9d5ff] border border-[#0f172a] block" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'}}></span> <span>ŞÖNİM / SHM</span>
         </div>
      </div>
    </div>
  );
}
