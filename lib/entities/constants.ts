// Subject and topic constants
export const TYT_SUBJECTS = [
  'Turkce',
  'Matematik',
  'Fizik',
  'Kimya',
  'Biyoloji',
  'Tarih',
  'Cografya',
  'Felsefe',
] as const;

export const AYT_SUBJECTS = [
  'Matematik',
  'Fizik',
  'Kimya',
  'Biyoloji',
  'Edebiyat',
  'Tarih',
  'Cografya',
  'Felsefe',
] as const;

export const TOPICS_BY_SUBJECT: Record<string, string[]> = {
  Turkce: ['Sozcukte Anlam', 'Cumle Yorumu', 'Paragraf', 'Dil Bilgisi', 'Anlatim Bozukluklari'],
  Matematik: [
    'Temel Kavramlar',
    'Sayilar',
    'Fonksiyonlar',
    'Polinomlar',
    'Trigonometri',
    'Logaritma',
    'Diziler',
    'Limit ve Turev',
    'Integral',
  ],
  Fizik: ['Kuvvet ve Hareket', 'Enerji', 'Elektrik', 'Manyetizma', 'Optik', 'Dalgalar'],
  Kimya: ['Atom ve Periyodik Sistem', 'Kimyasal Baglar', 'Mol Kavrami', 'Gazlar', 'Cozeltiler', 'Reaksiyonlar'],
  Biyoloji: ['Hucre', 'Canlilar', 'Genetik', 'Ekoloji', 'Sistemler'],
  Tarih: ['Ilk Caglar', 'Orta Cag', 'Osmanli', 'Inkilap Tarihi', 'Cagdas Dunya'],
  Cografya: ['Fiziki Cografya', 'Beseri Cografya', 'Turkiye Cografyasi', 'Bolge Cografyasi'],
  Felsefe: ['Felsefeye Giris', 'Bilgi Felsefesi', 'Varlik Felsefesi', 'Ahlak Felsefesi'],
  Edebiyat: ['Edebi Bilgiler', 'Donemler', 'Edebi Turler', 'Divan Edebiyati', 'Halk Edebiyati'],
};
