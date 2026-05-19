// TYT ve AYT Sınav Yapılandırması
// Her ders için soru sayıları ve konular tanımlı

export interface SubjectConfig {
  name: string;
  questionCount: number;
  topics: TopicConfig[];
}

export interface TopicConfig {
  name: string;
  subtopics: string[];
}

// TYT Türkçe (40 soru)
const TYT_TURKCE: SubjectConfig = {
  name: "Türkçe",
  questionCount: 40,
  topics: [
    {
      name: "Sözcükte Anlam",
      subtopics: [
        "Gerçek Anlam",
        "Mecaz Anlam",
        "Terim Anlam",
        "Eş Anlam",
        "Zıt Anlam",
        "Sözcükte Anlam İlişkileri",
        "Deyimler",
        "Atasözleri",
      ],
    },
    {
      name: "Cümle Bilgisi",
      subtopics: [
        "Cümle Türleri",
        "Cümle Yorumu",
        "Cümlede Anlam",
        "Anlatım Bozuklukları",
        "Cümle Ögeleri",
      ],
    },
    {
      name: "Paragraf",
      subtopics: [
        "Ana Düşünce",
        "Yardımcı Düşünce",
        "Paragraf Yapısı",
        "Paragraf Tamamlama",
        "Paragraf Oluşturma",
        "Anlatım Türleri",
      ],
    },
    {
      name: "Dil Bilgisi",
      subtopics: [
        "Ses Bilgisi",
        "Yazım Kuralları",
        "Noktalama İşaretleri",
        "Sözcük Yapısı",
        "Fiiller",
        "İsimler",
        "Sıfatlar",
        "Zarflar",
        "Edatlar-Bağlaçlar",
      ],
    },
  ],
};

// TYT Matematik (40 soru)
const TYT_MATEMATIK: SubjectConfig = {
  name: "Matematik",
  questionCount: 40,
  topics: [
    {
      name: "Temel Kavramlar",
      subtopics: [
        "Sayı Basamakları",
        "Bölme-Bölünebilme",
        "EBOB-EKOK",
        "Faktöriyel",
        "Asal Çarpanlara Ayırma",
      ],
    },
    {
      name: "Sayılar",
      subtopics: [
        "Rasyonel Sayılar",
        "Ondalık Sayılar",
        "Köklü Sayılar",
        "Üslü Sayılar",
        "Mutlak Değer",
      ],
    },
    {
      name: "Cebir",
      subtopics: [
        "Oran-Orantı",
        "Denklem Çözme",
        "Eşitsizlikler",
        "Problemler",
        "Yaş Problemleri",
        "İşçi Problemleri",
        "Hareket Problemleri",
        "Kesir Problemleri",
        "Yüzde Problemleri",
        "Kar-Zarar",
      ],
    },
    {
      name: "Fonksiyonlar",
      subtopics: [
        "Fonksiyon Tanımı",
        "Fonksiyon Grafikleri",
        "Bileşke Fonksiyon",
        "Ters Fonksiyon",
      ],
    },
    {
      name: "Geometri",
      subtopics: [
        "Açılar",
        "Üçgenler",
        "Dörtgenler",
        "Çember ve Daire",
        "Alan-Çevre",
        "Benzerlik-Eşlik",
        "Trigonometri Giriş",
      ],
    },
    {
      name: "Veri Analizi",
      subtopics: [
        "Olasılık",
        "İstatistik",
        "Grafikler",
        "Ortalama-Medyan-Mod",
      ],
    },
  ],
};

// TYT Fizik (7 soru)
const TYT_FIZIK: SubjectConfig = {
  name: "Fizik",
  questionCount: 7,
  topics: [
    {
      name: "Fizik Bilimine Giriş",
      subtopics: ["Fiziksel Nicelikleri", "Birim Sistemleri", "Vektörler"],
    },
    {
      name: "Madde ve Özellikleri",
      subtopics: ["Kütle-Hacim", "Özkütle", "Dayanıklılık"],
    },
    {
      name: "Hareket ve Kuvvet",
      subtopics: [
        "Hareket",
        "Newton Hareket Yasaları",
        "Sürtünme Kuvveti",
        "Yerçekimi",
      ],
    },
    {
      name: "Enerji",
      subtopics: [
        "İş-Güç-Enerji",
        "Kinetik Enerji",
        "Potansiyel Enerji",
        "Enerjinin Korunumu",
      ],
    },
    {
      name: "Isı ve Sıcaklık",
      subtopics: ["Isı-Sıcaklık", "Genleşme", "Hal Değişimi"],
    },
    {
      name: "Elektrik",
      subtopics: ["Elektriklenme", "Elektrik Akımı", "Direnç"],
    },
    {
      name: "Optik",
      subtopics: ["Işık ve Gölge", "Aynalar", "Işığın Kırılması"],
    },
    {
      name: "Dalgalar",
      subtopics: ["Ses Dalgaları", "Elektromanyetik Dalgalar"],
    },
  ],
};

// TYT Kimya (7 soru)
const TYT_KIMYA: SubjectConfig = {
  name: "Kimya",
  questionCount: 7,
  topics: [
    {
      name: "Kimya Bilimi",
      subtopics: ["Simya'dan Kimya'ya", "Kimyanın Uğraş Alanları", "Element-Bileşik-Karışım"],
    },
    {
      name: "Atom ve Periyodik Sistem",
      subtopics: [
        "Atom Modelleri",
        "Atom Altı Parçacıklar",
        "Periyodik Cetvel",
        "Periyodik Özellikler",
      ],
    },
    {
      name: "Kimyasal Türler Arası Etkileşimler",
      subtopics: [
        "Kimyasal Bağlar",
        "İyonik Bağ",
        "Kovalent Bağ",
        "Metalik Bağ",
        "Zayıf Etkileşimler",
      ],
    },
    {
      name: "Maddenin Halleri",
      subtopics: ["Katılar", "Sıvılar", "Gazlar", "Plazma"],
    },
    {
      name: "Doğa ve Kimya",
      subtopics: ["Su ve Hayat", "Hava ve Hayat", "Toprak Kimyası"],
    },
  ],
};

// TYT Biyoloji (6 soru)
const TYT_BIYOLOJI: SubjectConfig = {
  name: "Biyoloji",
  questionCount: 6,
  topics: [
    {
      name: "Canlıların Ortak Özellikleri",
      subtopics: ["Canlıların Yapısı", "Hücre", "Organeller"],
    },
    {
      name: "Hücre ve Organeller",
      subtopics: [
        "Hücre Zarı",
        "Sitoplazma",
        "Çekirdek",
        "Hücre Bölünmesi",
        "Mitoz",
        "Mayoz",
      ],
    },
    {
      name: "Canlıların Sınıflandırılması",
      subtopics: ["Bakteriler", "Arkeler", "Protistler", "Mantarlar", "Bitkiler", "Hayvanlar"],
    },
    {
      name: "Kalıtım",
      subtopics: ["DNA ve RNA", "Genetik Kod", "Mendel Genetiği"],
    },
    {
      name: "Ekosistem",
      subtopics: ["Besin Zinciri", "Besin Ağı", "Madde Döngüleri", "Çevre Sorunları"],
    },
  ],
};

// TYT Tarih (5 soru)
const TYT_TARIH: SubjectConfig = {
  name: "Tarih",
  questionCount: 5,
  topics: [
    {
      name: "Tarih Bilimine Giriş",
      subtopics: ["Tarihin Tanımı", "Tarihi Kaynaklar", "Tarih Yazıcılığı"],
    },
    {
      name: "İlk Çağ Uygarlıkları",
      subtopics: ["Mezopotamya", "Mısır", "Anadolu", "Yunan-Roma"],
    },
    {
      name: "İslam Tarihi ve Türk Tarihi",
      subtopics: [
        "İlk Türk Devletleri",
        "İslamiyet'in Doğuşu",
        "Türk-İslam Devletleri",
      ],
    },
    {
      name: "Osmanlı Tarihi",
      subtopics: ["Kuruluş", "Yükselme", "Duraklama", "Gerileme", "Dağılma"],
    },
    {
      name: "Türkiye Cumhuriyeti",
      subtopics: ["Milli Mücadele", "Atatürk İlkeleri", "Çağdaşlaşma"],
    },
  ],
};

// TYT Coğrafya (5 soru)
const TYT_COGRAFYA: SubjectConfig = {
  name: "Coğrafya",
  questionCount: 5,
  topics: [
    {
      name: "Doğal Sistemler",
      subtopics: [
        "Dünya'nın Şekli ve Hareketleri",
        "Harita Bilgisi",
        "İklim Bilgisi",
        "Yer Şekilleri",
      ],
    },
    {
      name: "Beşeri Sistemler",
      subtopics: ["Nüfus", "Yerleşme", "Göçler", "Ekonomik Faaliyetler"],
    },
    {
      name: "Türkiye Coğrafyası",
      subtopics: [
        "Türkiye'nin Konumu",
        "Türkiye'nin Yer Şekilleri",
        "Türkiye'nin İklimi",
        "Türkiye'nin Nüfusu",
      ],
    },
    {
      name: "Çevre ve Toplum",
      subtopics: ["Doğal Afetler", "Çevre Sorunları", "Sürdürülebilir Kalkınma"],
    },
  ],
};

// TYT Felsefe (5 soru)
const TYT_FELSEFE: SubjectConfig = {
  name: "Felsefe",
  questionCount: 5,
  topics: [
    {
      name: "Felsefeye Giriş",
      subtopics: ["Felsefenin Tanımı", "Felsefe ve Bilim", "Felsefe ve Din"],
    },
    {
      name: "Bilgi Felsefesi",
      subtopics: ["Bilginin Kaynağı", "Doğruluk", "Akılcılık", "Deneycilik"],
    },
    {
      name: "Varlık Felsefesi",
      subtopics: ["Varlık Nedir", "Materyalizm", "İdealizm"],
    },
    {
      name: "Ahlak Felsefesi",
      subtopics: ["Ahlak ve Etik", "Ahlak Kuramları", "Erdem"],
    },
  ],
};

// TYT Din Kültürü (5 soru)
const TYT_DIN: SubjectConfig = {
  name: "Din Kültürü",
  questionCount: 5,
  topics: [
    {
      name: "İnanç",
      subtopics: ["Allah İnancı", "Ahiret İnancı", "Kader İnancı"],
    },
    {
      name: "İbadet",
      subtopics: ["Namaz", "Oruç", "Zekat", "Hac"],
    },
    {
      name: "Hz. Muhammed",
      subtopics: ["Hayatı", "Öğretileri", "Ahlakı"],
    },
    {
      name: "Kur'an ve Yorumu",
      subtopics: ["Kur'an'ın Özellikleri", "Tefsir", "Meal"],
    },
  ],
};

// AYT Matematik (40 soru)
const AYT_MATEMATIK: SubjectConfig = {
  name: "Matematik",
  questionCount: 40,
  topics: [
    {
      name: "Fonksiyonlar",
      subtopics: [
        "Fonksiyon Kavramı",
        "Fonksiyon Türleri",
        "Bileşke Fonksiyon",
        "Ters Fonksiyon",
        "Fonksiyon Grafikleri",
      ],
    },
    {
      name: "Polinomlar",
      subtopics: [
        "Polinom Tanımı",
        "Polinom İşlemleri",
        "Çarpanlara Ayırma",
        "Kalan Bulma",
        "Polinom Denklemleri",
      ],
    },
    {
      name: "İkinci Dereceden Denklemler",
      subtopics: [
        "Köklerin Doğası",
        "Kök-Katsayı İlişkisi",
        "Parabol",
        "Eşitsizlikler",
      ],
    },
    {
      name: "Trigonometri",
      subtopics: [
        "Trigonometrik Fonksiyonlar",
        "Trigonometrik Özdeşlikler",
        "Toplam-Fark Formülleri",
        "Trigonometrik Denklemler",
        "Ters Trigonometrik Fonksiyonlar",
      ],
    },
    {
      name: "Logaritma",
      subtopics: [
        "Üstel Fonksiyonlar",
        "Logaritma Tanımı",
        "Logaritma Özellikleri",
        "Logaritmik Denklemler",
        "Logaritmik Eşitsizlikler",
      ],
    },
    {
      name: "Diziler",
      subtopics: [
        "Dizi Tanımı",
        "Aritmetik Dizi",
        "Geometrik Dizi",
        "Dizi Problemleri",
        "Seriler",
      ],
    },
    {
      name: "Limit ve Süreklilik",
      subtopics: [
        "Limit Kavramı",
        "Limit Hesaplama",
        "Belirsizlikler",
        "Süreklilik",
        "Sonsuzlukta Limit",
      ],
    },
    {
      name: "Türev",
      subtopics: [
        "Türev Kavramı",
        "Türev Kuralları",
        "Türev Uygulamaları",
        "Maksimum-Minimum",
        "Grafik Çizimi",
      ],
    },
    {
      name: "İntegral",
      subtopics: [
        "Belirsiz İntegral",
        "Belirli İntegral",
        "Alan Hesabı",
        "Hacim Hesabı",
        "İntegral Uygulamaları",
      ],
    },
    {
      name: "Analitik Geometri",
      subtopics: [
        "Doğru Denklemi",
        "Çember",
        "Parabol",
        "Elips",
        "Hiperbol",
      ],
    },
  ],
};

// AYT Fizik (14 soru)
const AYT_FIZIK: SubjectConfig = {
  name: "Fizik",
  questionCount: 14,
  topics: [
    {
      name: "Kuvvet ve Hareket",
      subtopics: [
        "Vektörler",
        "Bağıl Hareket",
        "Newton Yasaları",
        "Atış Hareketleri",
        "Dairesel Hareket",
      ],
    },
    {
      name: "Enerji ve Momentum",
      subtopics: [
        "İş-Güç-Enerji",
        "Enerji Korunumu",
        "Momentum",
        "İmpuls",
        "Çarpışmalar",
      ],
    },
    {
      name: "Elektrik ve Manyetizma",
      subtopics: [
        "Elektrik Alan",
        "Potansiyel",
        "Kondansatörler",
        "Manyetik Alan",
        "İndüksiyon",
        "Alternatif Akım",
      ],
    },
    {
      name: "Dalgalar",
      subtopics: [
        "Mekanik Dalgalar",
        "Elektromanyetik Dalgalar",
        "Ses",
        "Işık",
        "Kırınım-Girişim",
      ],
    },
    {
      name: "Modern Fizik",
      subtopics: [
        "Özel Görelilik",
        "Kuantum Fiziği",
        "Atom Modelleri",
        "Radyoaktivite",
        "Nükleer Fizik",
      ],
    },
  ],
};

// AYT Kimya (13 soru)
const AYT_KIMYA: SubjectConfig = {
  name: "Kimya",
  questionCount: 13,
  topics: [
    {
      name: "Modern Atom Teorisi",
      subtopics: [
        "Kuantum Sayıları",
        "Orbital Kavramı",
        "Elektron Dizilişi",
        "Periyodik Özellikler",
      ],
    },
    {
      name: "Kimyasal Hesaplamalar",
      subtopics: [
        "Mol Kavramı",
        "Kimyasal Tepkimeler",
        "Stokiyometri",
        "Verim Hesabı",
      ],
    },
    {
      name: "Gazlar",
      subtopics: [
        "İdeal Gaz Yasası",
        "Gaz Karışımları",
        "Gerçek Gazlar",
        "Kinetik Teori",
      ],
    },
    {
      name: "Çözeltiler",
      subtopics: [
        "Derişim Birimleri",
        "Çözünürlük",
        "Koligatif Özellikler",
      ],
    },
    {
      name: "Kimyasal Tepkimelerde Enerji",
      subtopics: [
        "Entalpi",
        "Entropi",
        "Serbest Enerji",
        "Hess Yasası",
      ],
    },
    {
      name: "Tepkime Hızları",
      subtopics: [
        "Hız Kavramı",
        "Hız Sabiti",
        "Hız Denklemi",
        "Aktivasyon Enerjisi",
      ],
    },
    {
      name: "Kimyasal Denge",
      subtopics: [
        "Denge Kavramı",
        "Denge Sabiti",
        "Le Chatelier İlkesi",
      ],
    },
    {
      name: "Asitler ve Bazlar",
      subtopics: [
        "Asit-Baz Tanımları",
        "pH Hesabı",
        "Tampon Çözeltiler",
        "Hidroliz",
      ],
    },
    {
      name: "Elektrokimya",
      subtopics: [
        "Redoks Tepkimeleri",
        "Elektroliz",
        "Piller",
        "Korozyon",
      ],
    },
    {
      name: "Organik Kimya",
      subtopics: [
        "Hidrokarbonlar",
        "Fonksiyonel Gruplar",
        "İzomeri",
        "Reaksiyon Türleri",
        "Polimerler",
      ],
    },
  ],
};

// AYT Biyoloji (13 soru)
const AYT_BIYOLOJI: SubjectConfig = {
  name: "Biyoloji",
  questionCount: 13,
  topics: [
    {
      name: "Hücre Biyolojisi",
      subtopics: [
        "Hücre Zarı ve Taşınım",
        "Organeller",
        "Enzimler",
        "Hücre Solunumu",
        "Fotosentez",
      ],
    },
    {
      name: "Hücre Bölünmeleri",
      subtopics: [
        "Mitoz",
        "Mayoz",
        "Hücre Döngüsü",
        "Kontrol Noktaları",
      ],
    },
    {
      name: "Moleküler Genetik",
      subtopics: [
        "DNA Yapısı",
        "DNA Replikasyonu",
        "Transkripsiyon",
        "Translasyon",
        "Gen Regülasyonu",
      ],
    },
    {
      name: "Kalıtım",
      subtopics: [
        "Mendel Genetiği",
        "Eşeye Bağlı Kalıtım",
        "Çok Alellilik",
        "Mutasyonlar",
        "Genetik Mühendisliği",
      ],
    },
    {
      name: "Bitki Biyolojisi",
      subtopics: [
        "Bitki Dokuları",
        "Su ve Mineral Taşınımı",
        "Bitkisel Hormonlar",
        "Bitki Hareketleri",
      ],
    },
    {
      name: "İnsan Fizyolojisi",
      subtopics: [
        "Sindirim Sistemi",
        "Dolaşım Sistemi",
        "Solunum Sistemi",
        "Boşaltım Sistemi",
        "Sinir Sistemi",
        "Endokrin Sistem",
        "Üreme ve Gelişme",
      ],
    },
    {
      name: "Komünite ve Popülasyon",
      subtopics: [
        "Popülasyon Ekolojisi",
        "Türler Arası İlişkiler",
        "Süksesyon",
        "Biyoçeşitlilik",
      ],
    },
  ],
};

// AYT Edebiyat (24 soru)
const AYT_EDEBIYAT: SubjectConfig = {
  name: "Türk Dili ve Edebiyatı",
  questionCount: 24,
  topics: [
    {
      name: "Edebi Bilgiler",
      subtopics: [
        "Edebi Türler",
        "Şiir Bilgisi",
        "Roman-Öykü",
        "Tiyatro",
        "Deneme-Makale",
      ],
    },
    {
      name: "İslamiyet Öncesi Türk Edebiyatı",
      subtopics: [
        "Sözlü Edebiyat",
        "Yazılı Edebiyat",
        "Destanlar",
        "Orhun Yazıtları",
      ],
    },
    {
      name: "Divan Edebiyatı",
      subtopics: [
        "Nazım Şekilleri",
        "Nazım Türleri",
        "Sanatçılar",
        "Nesir Türleri",
      ],
    },
    {
      name: "Halk Edebiyatı",
      subtopics: [
        "Anonim Halk Edebiyatı",
        "Aşık Edebiyatı",
        "Tekke Edebiyatı",
      ],
    },
    {
      name: "Tanzimat Edebiyatı",
      subtopics: [
        "I. Dönem",
        "II. Dönem",
        "Önemli Eserler",
        "Sanatçılar",
      ],
    },
    {
      name: "Servet-i Fünun ve Fecr-i Ati",
      subtopics: [
        "Özellikleri",
        "Sanatçılar",
        "Önemli Eserler",
      ],
    },
    {
      name: "Milli Edebiyat",
      subtopics: [
        "Özellikleri",
        "Beş Hececiler",
        "Sanatçılar",
      ],
    },
    {
      name: "Cumhuriyet Dönemi Edebiyatı",
      subtopics: [
        "1923-1940",
        "1940-1960",
        "1960 Sonrası",
        "Çağdaş Türk Edebiyatı",
      ],
    },
  ],
};

// AYT Tarih (10 soru)
const AYT_TARIH: SubjectConfig = {
  name: "Tarih",
  questionCount: 10,
  topics: [
    {
      name: "İlk ve Orta Çağ",
      subtopics: [
        "İlk Uygarlıklar",
        "Yunan-Roma",
        "Orta Çağ Avrupa",
        "Kavimler Göçü",
      ],
    },
    {
      name: "Türk-İslam Tarihi",
      subtopics: [
        "İslamiyet'in Doğuşu",
        "Emeviler-Abbasiler",
        "Türk-İslam Devletleri",
        "Selçuklular",
      ],
    },
    {
      name: "Osmanlı Tarihi",
      subtopics: [
        "Kuruluş Dönemi",
        "Yükselme Dönemi",
        "Duraklama Dönemi",
        "Gerileme Dönemi",
        "Dağılma Dönemi",
        "Islahatlar",
      ],
    },
    {
      name: "Çağdaş Türk ve Dünya Tarihi",
      subtopics: [
        "I. Dünya Savaşı",
        "Milli Mücadele",
        "Atatürk İlkeleri",
        "II. Dünya Savaşı",
        "Soğuk Savaş",
        "Günümüz",
      ],
    },
  ],
};

// AYT Coğrafya (6 soru)
const AYT_COGRAFYA: SubjectConfig = {
  name: "Coğrafya",
  questionCount: 6,
  topics: [
    {
      name: "Fiziki Coğrafya",
      subtopics: [
        "Jeomorfoloji",
        "Hidrografya",
        "İklim Bilgisi",
        "Biyocoğrafya",
      ],
    },
    {
      name: "Beşeri ve Ekonomik Coğrafya",
      subtopics: [
        "Nüfus Coğrafyası",
        "Yerleşme",
        "Tarım",
        "Sanayi",
        "Enerji",
        "Ulaşım",
        "Ticaret",
      ],
    },
    {
      name: "Bölgesel Coğrafya",
      subtopics: [
        "Türkiye Bölgeleri",
        "Dünya Bölgeleri",
        "Ülkeler",
      ],
    },
    {
      name: "Çevre ve Doğal Kaynaklar",
      subtopics: [
        "Doğal Kaynaklar",
        "Çevre Sorunları",
        "Doğal Afetler",
      ],
    },
  ],
};

// AYT Felsefe Grubu (12 soru)
const AYT_FELSEFE: SubjectConfig = {
  name: "Felsefe Grubu",
  questionCount: 12,
  topics: [
    {
      name: "Felsefe",
      subtopics: [
        "Bilgi Felsefesi",
        "Bilim Felsefesi",
        "Varlık Felsefesi",
        "Ahlak Felsefesi",
        "Sanat Felsefesi",
        "Din Felsefesi",
        "Siyaset Felsefesi",
      ],
    },
    {
      name: "Mantık",
      subtopics: [
        "Kavram",
        "Önerme",
        "Akıl Yürütme",
        "Sembolik Mantık",
      ],
    },
    {
      name: "Psikoloji",
      subtopics: [
        "Psikolojinin Tanımı",
        "Gelişim Psikolojisi",
        "Öğrenme",
        "Bellek",
        "Kişilik",
      ],
    },
    {
      name: "Sosyoloji",
      subtopics: [
        "Sosyolojinin Tanımı",
        "Toplum",
        "Kültür",
        "Toplumsal Kurumlar",
        "Toplumsal Değişme",
      ],
    },
  ],
};

// AYT Din Kültürü (6 soru)
const AYT_DIN: SubjectConfig = {
  name: "Din Kültürü",
  questionCount: 6,
  topics: [
    {
      name: "İnanç ve İbadet",
      subtopics: [
        "İslam ve İnanç",
        "İslam ve İbadet",
        "İslam Düşüncesinde Yorumlar",
      ],
    },
    {
      name: "Hz. Muhammed",
      subtopics: [
        "Peygamberlik",
        "Sünnet",
        "Örnek Şahsiyet",
      ],
    },
    {
      name: "Kur'an",
      subtopics: [
        "Vahiy ve Kur'an",
        "Kur'an'ın Ana Konuları",
        "Kur'an Yorumları",
      ],
    },
    {
      name: "İslam Düşüncesi",
      subtopics: [
        "Tasavvuf",
        "İslam Mezhepleri",
        "İslam ve Bilim",
      ],
    },
  ],
};

// Sınav Yapılandırmaları
export const TYT_CONFIG: SubjectConfig[] = [
  TYT_TURKCE,
  TYT_MATEMATIK,
  TYT_FIZIK,
  TYT_KIMYA,
  TYT_BIYOLOJI,
  TYT_TARIH,
  TYT_COGRAFYA,
  TYT_FELSEFE,
  TYT_DIN,
];

export const AYT_CONFIG: SubjectConfig[] = [
  AYT_MATEMATIK,
  AYT_FIZIK,
  AYT_KIMYA,
  AYT_BIYOLOJI,
  AYT_EDEBIYAT,
  AYT_TARIH,
  AYT_COGRAFYA,
  AYT_FELSEFE,
  AYT_DIN,
];

// Toplam soru sayıları
export const TYT_TOTAL_QUESTIONS = TYT_CONFIG.reduce((sum, s) => sum + s.questionCount, 0); // 120
export const AYT_TOTAL_QUESTIONS = AYT_CONFIG.reduce((sum, s) => sum + s.questionCount, 0); // 160

// Yardımcı fonksiyonlar
export function getExamConfig(examType: "TYT" | "AYT"): SubjectConfig[] {
  return examType === "TYT" ? TYT_CONFIG : AYT_CONFIG;
}

export function getTotalQuestions(examType: "TYT" | "AYT"): number {
  return examType === "TYT" ? TYT_TOTAL_QUESTIONS : AYT_TOTAL_QUESTIONS;
}

export function getSubjectByName(examType: "TYT" | "AYT", subjectName: string): SubjectConfig | undefined {
  const config = getExamConfig(examType);
  return config.find(s => s.name === subjectName);
}
