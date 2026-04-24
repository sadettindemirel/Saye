export type KidCategory = "Learning" | "Play" | "Support" | "Culture" | "Digital";

export type KidZone = {
  id: string;
  name: string;
  address: string;
  category: KidCategory;
  lat: number;
  lng: number;
  description?: string;
  rating?: number;
  hours?: string; 
};

export const KID_ZONES: KidZone[] = [
  { 
    id: 'kz-1', 
    name: 'Atatürk Kitaplığı Çocuk Bölümü', 
    address: 'Taksim, Beyoğlu', 
    category: 'Learning', 
    lat: 41.0368, 
    lng: 28.9850,
    description: "Zengin çocuk kitapları koleksiyonu ve sessiz okuma alanları. Hafta sonu masal dinletileri yapılıyor."
  },
  { 
    id: 'kz-2', 
    name: 'İSMEK Fatih Çocuk Merkezi', 
    address: 'Fatih', 
    category: 'Learning', 
    lat: 41.0122, 
    lng: 28.9388,
    description: "Çocuklar için yaratıcı atölyeler, boyama ve el becerisi geliştirme kursları ücretsiz."
  },
  { 
    id: 'kz-3', 
    name: 'Göztepe 60. Yıl Parkı', 
    address: 'Göztepe, Kadıköy', 
    category: 'Play', 
    lat: 40.9734, 
    lng: 29.0558,
    description: "Geniş çim alanlar, güvenli kauçuk zeminli büyük oyun parkları ve bebek bakım odaları."
  },
  { 
    id: 'kz-4', 
    name: 'Maçka Demokrasi Parkı', 
    address: 'Şişli', 
    category: 'Play', 
    lat: 41.0416, 
    lng: 28.9958,
    description: "Ağaçlık alan, piknik masaları ve çocuklar için teleferik izleme keyfi güvenli noktalar."
  },
  { 
    id: 'kz-5', 
    name: 'Beylikdüzü Yaşam Vadisi', 
    address: 'Beylikdüzü', 
    category: 'Play', 
    lat: 40.9934, 
    lng: 28.6416,
    description: "Bisiklet yolları, süs havuzları ve dev çocuk oyun adası. Aile yürüyüşleri için ideal."
  },
  { 
    id: 'kz-6', 
    name: 'ÇOCUK-YAM (Çocuk Psikolojik Destek)', 
    address: 'Üsküdar / Kadıköy Sınırı', 
    category: 'Support', 
    lat: 41.0089, 
    lng: 29.0233,
    description: "Uzman çocuk pedagogları eşliğinde travma onarımı ve oyun terapisi seansları (Randevulu)."
  },
  { 
    id: 'kz-7', 
    name: 'Bakırköy Botanik Parkı', 
    address: 'Bakırköy', 
    category: 'Play', 
    lat: 40.9911, 
    lng: 28.8711,
    description: "Tematik bahçeler, 11 adet tematik çocuk oyun alanı ve gölet."
  },
  { 
    id: 'kz-8', 
    name: 'Eyüpsultan Çocuk Kütüphanesi', 
    address: 'Eyüpsultan', 
    category: 'Learning', 
    lat: 41.0470, 
    lng: 28.9348,
    description: "Masal şatosu konseptli okuma alanları, akıl ve zeka oyunları atölyesi."
  },
  { 
    id: 'kz-9', 
    name: 'SHM Çocuk Görüşme Merkezi', 
    address: 'Şişli', 
    category: 'Support', 
    lat: 41.0583, 
    lng: 28.9818,
    description: "Sosyal Hizmet Merkezi bünyesinde çocuk hakları ve ruh sağlığı değerlendirme randevuları."
  }
];
