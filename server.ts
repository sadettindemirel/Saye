import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Papa from "papaparse";

const app = express();
const PORT = 3000;

// Simple Node Cache to respect Nominatim limits and speed up subsequent loads
const geocodeCache = new Map<string, {lat: number, lng: number}>();
const CACHE_CSV_ZONES = { data: null, timestamp: 0 };
const CACHE_TTL = 1000 * 60 * 10; // 10 mins

async function geocodeNominatim(address: string) {
  if (!address) return null;
  const cleanAddress = address.slice(0, 100); // Prevent ultra-long query errors
  if (geocodeCache.has(cleanAddress)) return geocodeCache.get(cleanAddress);

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanAddress + ', İstanbul')}&format=json&limit=1`, {
      headers: {
        'User-Agent': 'SayeSafetyApp/1.0 (ali.torabi.1997@gmail.com)'
      }
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (data && data.length > 0) {
      const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      geocodeCache.set(cleanAddress, coords);
      return coords;
    }
  } catch (error) {
    console.error("Geocoding failed for", cleanAddress, error);
  }
  return null;
}

// Ensure 1-second delay for Nominatim TOS
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function startServer() {

  app.get("/api/csv-zones", async (req, res) => {
    if (CACHE_CSV_ZONES.data && Date.now() - CACHE_CSV_ZONES.timestamp < CACHE_TTL) {
      return res.json(CACHE_CSV_ZONES.data);
    }

    try {
      const zones = [];

      // 1. DIGITAL (WIFI)
      const digRes = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQd8_e7imCIs2VoeKW9XLljuf5Q52WH-p6EDYfbhp871RttnHAQrdd3LzxriNPPEa8M7dB-4BXd95Fx/pub?output=csv");
      const digCsv = await digRes.text();
      const parsedDig = Papa.parse(digCsv, { header: true, skipEmptyLines: true });
      // Limit to 20 for UI perf
      const digRows = parsedDig.data.filter((r:any) => r.latitude && r.latitude !== '0').slice(0, 30);
      digRows.forEach((r: any) => {
        zones.push({
          id: `dig-${Math.random()}`,
          name: r.location || "Dijital Destek Noktası",
          category: 'Digital',
          address: r.location_type || "WiFi Alanı",
          lat: parseFloat(r.latitude),
          lng: parseFloat(r.longitude),
          description: "Saye Dijital İletişim (İBB WiFi Noktası)"
        });
      });

      // 2. LEARNING (LIBRARY)
      const libRes = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vR7sCwfCKGZbVDTdVBIr0ZWcduVdMYMczMPQzDvS3BPLWcM2ShcRdbQyrQWcT3zvyNCdMYetJxZYKOS/pub?output=csv");
      const libCsv = await libRes.text();
      const parsedLib = Papa.parse(libCsv, { header: true, skipEmptyLines: true });
      // Limit to top 10 due to Nominatim limits
      const libRows = parsedLib.data.slice(0, 10);
      
      for (const r of libRows as any[]) {
        const address = r['Adres'] || r['İlçe Adı'] + ', Istanbul';
        const coords = await geocodeNominatim(address);
        await delay(1000); // Nominatim 1 request/sec limit
        if (coords) {
          zones.push({
            id: `lib-${Math.random()}`,
            name: r['Kütüphane Adı'] || "Öğrenim Merkezi",
            category: 'Learning',
            address: address,
            lat: coords.lat,
            lng: coords.lng,
            hours: r['Çalışma Saatleri'] || undefined,
            description: "Güvenli Öğrenim ve Araştırma Alanı"
          });
        }
      }

      // 3. CULTURE (MUSEUM)
      const culRes = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTPX7moTwc3ZhLKgDlWshM2dB3kK83HwgEud6urEmJWVF6fk9ERQgHIZuEYoK3O7dB2WP1nbQUOB2Y8/pub?output=csv");
      const culCsv = await culRes.text();
      const parsedCul = Papa.parse(culCsv, { header: true, skipEmptyLines: true });
      // Limit to top 10
      const culRows = parsedCul.data.slice(0, 10);
      
      for (const r of culRows as any[]) {
        const address = r['Adres'] || r['Ilce Adi'] + ', Istanbul';
        const coords = await geocodeNominatim(address);
        await delay(1000); // 1 request/sec
        if (coords) {
          zones.push({
            id: `cul-${Math.random()}`,
            name: r['Muze Adi'] || "Kültür Merkezi",
            category: 'Culture',
            address: address,
            lat: coords.lat,
            lng: coords.lng,
            hours: r['Calisma Saatleri'] || undefined,
            description: "Çocuk dostu kültürel keşif alanı"
          });
        }
      }

      CACHE_CSV_ZONES.data = zones as any;
      CACHE_CSV_ZONES.timestamp = Date.now();
      res.json(zones);

    } catch (err) {
      console.error("CSV Route Error: ", err);
      res.status(500).json({ error: "Failed to process CSV Zones" });
    }
  });

  // OVERPASS API FOR PARKS & ISMEK
  app.get("/api/overpass", async (req, res) => {
    const { lat, lng, type } = req.query;
    if (!lat || !lng) return res.status(400).json({error: "lat and lng required"});

    // Adjusted parameters based on the type (ismek requires larger radius, parks require smaller)
    const radius = type === "ismek" ? 10000 : 3000;
    const nwrFilter = type === "ismek" 
      ? `nwr["name"~"İSMEK|Enstitü İstanbul|ismek",i](around:${radius},${lat},${lng});`
      : `nwr["leisure"="park"](around:${radius},${lat},${lng});`;

    const query = `
      [out:json];
      ${nwrFilter}
      out center 15;
    `;
    
    // Multiple public Overpass API instances to fallback on rate-limits
    const endpoints = [
      "https://overpass.openstreetmap.fr/api/interpreter", // very reliable, less rate limited
      "https://overpass.kumi.systems/api/interpreter",     // community instance
      "https://overpass-api.de/api/interpreter"            // heavily rate limited original server
    ];

    let success = false;
    let fallbackData: any[] = [];

    for (const url of endpoints) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "SayeSafetyApp/1.0 (ali.torabi.1997@gmail.com)"
          },
          body: "data=" + encodeURIComponent(query)
        });

        if (response.status === 429 || response.status === 504) {
          console.warn(`Overpass URL ${url} hit rate limit or timeout, trying next...`);
          continue; 
        }

        if (!response.ok) {
           console.warn(`Overpass URL ${url} failed: ${response.statusText}`);
           continue;
        }
        
        const data = await response.json();
        fallbackData = (data.elements || []).map((el: any) => {
          const pLat = el.lat || el.center?.lat;
          const pLng = el.lon || el.center?.lon;
          const name = el.tags?.name || (type === "ismek" ? "Enstitü İstanbul İSMEK" : "Halka Açık Park");
          const category = type === "ismek" ? "Learning" : "Play";
          const desc = type === "ismek" 
             ? "İstanbul Büyükşehir Belediyesi Hayat Boyu Öğrenme Merkezi."
             : "OpenStreetMap'ten tespit edilen dinamik açık alan.";

          return {
            id: `${type}-${el.id}`,
            name: name,
            category: category,
            address: type === "ismek" ? "Eğitim / Kurs Merkezi" : "Yerel Park / Dinlenme Alanı",
            lat: pLat,
            lng: pLng,
            description: desc
          };
        }).filter((p: any) => p.lat && p.lng);
        
        success = true;
        break; // Got the data, stop trying
      } catch (err: any) {
        console.warn(`Overpass URL ${url} error: ${err.message}`);
      }
    }

    if (!success) {
      console.error("All Overpass endpoints failed. Returning empty array.");
      return res.json([]); 
    }

    res.json(fallbackData);
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
