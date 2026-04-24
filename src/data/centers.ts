export type CenterInfo = {
  id: string;
  name: string;
  address: string;
  phone: string;
  telLink: string;
  category: "ŞÖNİM" | "SHM";
  lat: number;
  lng: number;
};

export const ISTANBUL_CENTERS: CenterInfo[] = [
  {
    id: "sonim-1",
    name: "İstanbul Şiddet Önleme ve İzleme Merkezi (ŞÖNİM)",
    address: "Fulya Mah. Büyükdere Cad. No: 74 Şişli/İstanbul",
    phone: "0212 212 91 11",
    telLink: "tel:+902122129111",
    category: "ŞÖNİM",
    lat: 41.0658,
    lng: 28.9912
  },
  {
    id: "shm-1",
    name: "Şişli Sosyal Hizmet Merkezi",
    address: "Halide Edip Adıvar Mah. Darülaceze Cad. Şişli/İstanbul",
    phone: "0212 222 11 00",
    telLink: "tel:+902122221100",
    category: "SHM",
    lat: 41.0583,
    lng: 28.9818
  },
  {
    id: "shm-2",
    name: "Kadıköy Sosyal Hizmet Merkezi",
    address: "Hasanpaşa Mah. Fahrettin Kerim Gökay Cad. Kadıköy/İstanbul",
    phone: "0216 325 22 22",
    telLink: "tel:+902163252222",
    category: "SHM",
    lat: 40.9902,
    lng: 29.0435
  },
  {
    id: "shm-3",
    name: "Fatih Sosyal Hizmet Merkezi",
    address: "Akşemsettin Mah. Adnan Menderes Bulvarı Fatih/İstanbul",
    phone: "0212 524 33 55",
    telLink: "tel:+902125243355",
    category: "SHM",
    lat: 41.0185,
    lng: 28.9419
  },
  {
    id: "shm-4",
    name: "Üsküdar Sosyal Hizmet Merkezi",
    address: "Mimar Sinan Mah. Çavuşdere Cad. Üsküdar/İstanbul",
    phone: "0216 333 44 44",
    telLink: "tel:+902163334444",
    category: "SHM",
    lat: 41.0252,
    lng: 29.0175
  }
];
