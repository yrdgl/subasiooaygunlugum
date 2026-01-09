// Mock data for Ay Bilgi Sitesi

export const moonPhases = [
  { id: 1, emoji: '🌑', name: 'Yeni Ay', description: 'Ay gökyüzünde görünmez çünkü Güneş ile Dünya arasında. Karanlık bir gece gibi.' },
  { id: 2, emoji: '🌒', name: 'Hilal', description: 'Yeni aydan sonra beliren ince hilal. İnce bir ışık şeridi gibi görünür.' },
  { id: 3, emoji: '🌓', name: 'İlk Dördün', description: 'Ayın yarısı aydınlık yarısı karanlık. D harfi gibi görünür.' },
  { id: 4, emoji: '🌔', name: 'Şişkin Ay', description: 'Dolunaya yaklaşan ay. Neredeyse tamamen aydınlık görünür.' },
  { id: 5, emoji: '🌕', name: 'Dolunay', description: 'Ay tamamen aydınlık ve yuvarlak. En parlak halidir.' },
  { id: 6, emoji: '🌖', name: 'Şişkin Ay', description: 'Dolunaydan sonra küçülmeye başlayan ay. Hala çok parlak.' },
  { id: 7, emoji: '🌗', name: 'Son Dördün', description: 'Ayın yarısı aydınlık yarısı karanlık. Ters D gibi görünür.' },
  { id: 8, emoji: '🌘', name: 'Hilal', description: 'Yeni aya yaklaşan ince hilal. Son ışık şeridi.' }
];

export const moonProperties = [
  {
    id: 1,
    title: 'Ay Ne Kadar Büyük?',
    value: "Dünya'nın 1/4'ü",
    description: "Dünya'ya göre çok küçük. 4 Ay yan yana koysan 1 Dünya eder."
  },
  {
    id: 2,
    title: "Ay'da Yerçekimi",
    value: '6 kat daha az',
    description: "Ay'da zıplarsan çok yükseğe çıkarsın! Astronotlar ağır yürür."
  },
  {
    id: 3,
    title: 'Dünya Etrafında Dolanma',
    value: '29.5 gün',
    description: "Ay'ın Dünya etrafında bir tur atması 1 ay sürüyor."
  },
  {
    id: 4,
    title: 'Kendi Etrafında Dönme',
    value: '27.3 gün',
    description: "Ay'ın kendi etrafında dönmesi de aynı sürede oluyor."
  }
];

export const earthEffects = [
  {
    id: 1,
    icon: '🌊',
    title: 'Denizlerdeki Gelgit',
    description: "Ay'ın çekim gücü denizleri çeker. Bu yüzden deniz suyu günde 2 kez yükselir ve alçalır. Balıkçılar bunu çok iyi bilir!",
    detail: 'Her gün 2 kez gelgit olur'
  },
  {
    id: 2,
    icon: '🌙',
    title: 'Gece Işığı',
    description: 'Ay geceleri bize ışık verir. Güneş ışığını yansıtarak geceleri aydınlık olmasını sağlar. Dolunayda çok parlak olur!',
    detail: 'Gecelerde doğal aydınlatma'
  },
  {
    id: 3,
    icon: '⏰',
    title: 'Günlerimizi Etkiler',
    description: "Ay, Dünya'nın dönüşünü yavaş yavaş yavaşlatıyor. Çok uzun zaman sonra günlerimiz daha uzun olacak.",
    detail: 'Günler çok yavaş uzuyor'
  },
  {
    id: 4,
    icon: '🍂',
    title: 'Mevsimlerimizi Dengeler',
    description: "Ay, Dünya'nın eğilimini dengede tutar. Bu sayede mevsimlerimiz düzenli olur. Ay olmasaydı çok farklı bir iklimimiz olurdu.",
    detail: 'Düzenli mevsimler'
  }
];

export const dailyJournals = [
  {
    id: 1,
    emoji: '🌔',
    date: '1 Kasım 2025',
    time: '20:30',
    phase: 'Şişkin Ay',
    title: 'İlk Şişkin Ay ile Kasım Başladı!',
    preview: 'Bu gece ay çok büyük ve şişkin görünüyor! Kasım ayına şişkin ay fazıyla başladık. Ay\'ın sadece sol k...',
    rating: 'Çok İyi',
    weather: 'Açık',
    content: `Bu gece ay çok büyük ve şişkin görünüyor! Kasım ayına şişkin ay fazıyla başladık. Ay'ın sadece sol kenarında küçük bir karanlık alan var.

Şişkin ay fazı dolunaya çok yakın olduğu için çok parlak. Bahçeyi güzelce aydınlatıyor. Teleskopla baktığımda mare denilen koyu düz alanları çok net görebiliyorum.

Bu ay fazı bana heyecan veriyor çünkü birkaç gün sonra dolunay olacak! Şişkin ay sanki bize "hazır olun, dolunay geliyor!" diyor gibi.

Kasım ayında hangi fazları göreceğiz acaba? Bu güzel şişkin ayla başlangıç çok iyi oldu.`,
    observations: [
      'Sol kenarında küçük karanlık alan',
      'Çok parlak ve büyük görünüyor',
      'Mare alanları çok belirgin',
      'Dolunaya yaklaşıyor hissi var'
    ]
  },
  {
    id: 2,
    emoji: '🌕',
    date: '9 Kasım 2025',
    time: '21:30',
    phase: 'Dolunay',
    title: 'Muhteşem Dolunay Gecesi!',
    preview: 'Vay canına! Bu gece tam dolunay ve inanılmaz güzel! Ay tamamen yuvarlak ve çok parlak. Sanki dev bir...',
    rating: 'Mükemmel',
    weather: 'Berrak',
    content: `Vay canına! Bu gece tam dolunay ve inanılmaz güzel! Ay tamamen yuvarlak ve çok parlak. Sanki dev bir lamba asılmış gökyüzüne.

Dolunay gecesi çok özel. Ay o kadar parlak ki gece neredeyse gündüz gibi. Bahçedeki ağaçların gölgeleri çok net. Ay ışığında koşup oynayabiliyorum!

Teleskopla baktığımda ayın her detayını görebiliyorum. Büyük kraterler, dağ sıraları, düz ovalar... Her şey kristal berraklığında! En büyük kraterlerden birinin kenarlarını saydım - çok büyük!

Öğretmenimiz dolunayda gelgitlerin en güçlü olduğunu söylemişti. Denizler bu gece en çok yükseliyor olmalı. Ay'ın gücü ne kadar da büyük!`,
    observations: [
      'Tam yuvarlak ve çok parlak',
      'Gece neredeyse gündüz gibi aydınlık',
      'Krater detayları mükemmel',
      'En güçlü gelgit zamanı'
    ]
  },
  {
    id: 3,
    emoji: '🌗',
    date: '17 Kasım 2025',
    time: '22:15',
    phase: 'Son Dördün',
    title: 'Son Dördün - Ters D Gibi!',
    preview: 'Bu gece ay tekrar yarım ama bu sefer ters D gibi duruyor! Sol yarısı aydınlık, sağ yarısı karanlık. ...',
    rating: 'Çok İyi',
    weather: 'Berrak',
    content: `Bu gece ay tekrar yarım ama bu sefer ters D gibi duruyor! Sol yarısı aydınlık, sağ yarısı karanlık. İlk dördünün tam tersi!

Son dördün fazı da krater gözlemleri için harika. Ama bu sefer farklı kraterleri daha net görebiliyorum çünkü ışık farklı açıdan vuruyor. Aynı kraterler farklı görünüyor!

Bu fazda ay gece yarısından sonra doğuyor. Sabah erkenden kalktığımda gökyüzünde güzelce duruyordu. Sabah ayı da çok güzel bir manzara!

Ay artık yavaş yavaş küçülmeye devam edecek. Bir hafta sonra yeni aya ulaşacak ve döngü tamamlanacak.`,
    observations: [
      'Ters D şeklinde görünüyor',
      'Sol yarısı aydınlık, sağ yarısı karanlık',
      'Farklı kraterleri net görebiliyorum',
      'Sabah saatlerinde de güzel'
    ]
  },
  {
    id: 4,
    emoji: '🌑',
    date: '24 Kasım 2025',
    time: '19:00',
    phase: 'Yeni Ay',
    title: 'Yeni Ay - Görünmez Faz',
    preview: 'Bu gece yeni ay! Gökyüzünde Ay görünmüyor çünkü Güneş ile Dünya arasında konumlanmış. Bu çok ilginç ...',
    rating: 'Görünmez',
    weather: 'Açık',
    content: `Bu gece yeni ay! Gökyüzünde Ay görünmüyor çünkü Güneş ile Dünya arasında konumlanmış. Bu çok ilginç çünkü ay orada ama göremiyoruz!

Yeni ay fazı beni hem heyecanlandırıyor hem üzüyor. Üzüyor çünkü ay görünmüyor, heyecanlandırıyor çünkü yeni bir döngü başlıyor.

Bu gece yıldızlar çok parlak görünüyor çünkü ayın ışığı yok. Teleskopla Saturn'ü ve Jüpiter'i çok net gördüm. Ay yokken diğer gezegenleri daha iyi izleyebiliyoruz.

Birkaç gün sonra ince hilal belirmeye başlayacak. O zaman ay tekrar gözükecek ve büyümeye başlayacak. Doğanın döngüsü ne kadar mükemmel!`,
    observations: [
      'Ay gökyüzünde görünmüyor',
      'Yıldızlar daha parlak',
      'Diğer gezegenler net görünüyor',
      'Yeni döngü başlıyor'
    ]
  },
  {
    id: 5,
    emoji: '🌒',
    date: '28 Kasım 2025',
    time: '18:45',
    phase: 'Hilal',
    title: 'İlk Hilal Belirdi!',
    preview: 'Vay be! Yeni aydan sonra ilk hilali gördüm! Çok ince ve güzel bir hilal. Tırnak gibi ince ama çok um...',
    rating: 'Zor',
    weather: 'Az Bulutlu',
    content: `Vay be! Yeni aydan sonra ilk hilali gördüm! Çok ince ve güzel bir hilal. Tırnak gibi ince ama çok umut verici.

Babamla birlikte batı ufkuna baktık. Güneş battıktan hemen sonra o ince hilal belirdi. İlk başta fark etmek zor oldu ama sonra çok belirgin hale geldi.

Hilal gördüğümde çok mutlu oldum! Sanki ayın bize "Merhaba, geri döndüm!" dediği gibi. Ay tekrar büyümeye başlayacak artık.

Bu hilal bana yeni başlangıçları hatırlatıyor. Kasım ayını güzel geçirdik ve şimdi Aralık'a doğru ilerliyoruz.`,
    observations: [
      'İlk hilal çok ince ama güzel',
      'Batı ufkunda belirdi',
      'Umut verici bir görünüm',
      'Yeni başlangıç hissi'
    ]
  },
  {
    id: 6,
    emoji: '🌓',
    date: '5 Aralık 2025',
    time: '20:15',
    phase: 'İlk Dördün',
    title: 'İlk Dördün - D Harfi Şekli',
    preview: 'Bu gece ay tam yarım görünüyor ve D harfi gibi duruyor! Öğretmenimizin dediği gibi gerçekten de İlk ...',
    rating: 'Mükemmel',
    weather: 'Berrak',
    content: `Bu gece ay tam yarım görünüyor ve D harfi gibi duruyor! Öğretmenimizin dediği gibi gerçekten de İlk Dördün fazı bu.

Ayın sağ yarısı tamamen aydınlık, sol yarısı tamamen karanlık. Çok keskin bir çizgi var ortada. Bu çizgiye "terminator" diyorlarmış. Ne havalı bir isim!

İlk dördün fazı krater gözlemleri için en iyi zamandır çünkü ışık ve gölge çok net. Büyük bir krater gördüm, içinde küçük bir dağ varmış gibi görünüyordu.

Ay artık hızla büyüyor. Bir hafta sonra şişkin ay olacak, ondan sonra da dolunay. Heyecan verici!`,
    observations: [
      'D harfi şeklinde çok net',
      'Terminator çizgisi keskin',
      'Kraterler belirgin görünüyor',
      'İçinde dağlı krater gördüm'
    ]
  },
  {
    id: 7,
    emoji: '🌔',
    date: '13 Aralık 2025',
    time: '21:00',
    phase: 'Şişkin Ay',
    title: 'Şişkin Ay Tekrar Büyük!',
    preview: 'Bu gece ay yine çok büyük ve şişkin! Dolunaya çok yaklaşmış. Sadece sol kenarında küçük bir karanlık...',
    rating: 'Çok İyi',
    weather: 'Açık',
    content: `Bu gece ay yine çok büyük ve şişkin! Dolunaya çok yaklaşmış. Sadece sol kenarında küçük bir karanlık alan kalmış.

Şişkin ay fazı beni çok heyecanlandırıyor çünkü dolunayın habercisi. Çok parlak ve güzel duruyor gökyüzünde. Bahçeyi neredeyse gündüz gibi aydınlatıyor.

Mare denilen düz alanları bu fazda çok net görebiliyorum. Koyu renkli büyük ovalar çok belirgin. Ay'ın yüzeyindeki renk farkları harika görünüyor.

Birkaç gün sonra dolunay olacak. O zaman ay en parlak ve en güzel halinde olacak. Sabırsızlıkla bekliyorum!`,
    observations: [
      'Sol kenarında küçük karanlık alan',
      'Çok parlak ve büyük',
      'Mare alanları çok net',
      'Dolunaya yaklaşıyor'
    ]
  },
  {
    id: 8,
    emoji: '🌕',
    date: '19 Aralık 2025',
    time: '21:45',
    phase: 'Dolunay',
    title: 'Aralık Dolunayı - Yılın Son Dolunayı!',
    preview: 'Bu gece yılın son dolunayını görüyorum! Aralık dolunayı çok özel ve muhteşem. Kar taneleriyle birlik...',
    rating: 'Mükemmel',
    weather: 'Berrak',
    content: `Bu gece yılın son dolunayını görüyorum! Aralık dolunayı çok özel ve muhteşem. Kar taneleriyle birlikte çok büyülü bir manzara oluşturmuş.

Dolunay gecesi her zaman harika ama bu sefer daha da özel hissediyorum. Yıl sonuna doğru böyle güzel bir dolunay görmek çok güzel.

Teleskopla baktığımda ayın her detayını mükemmel görebiliyorum. Tycho krateri çok belirgin, merkezinden çıkan ışın çizgileri çok parlak.

Bu dolunay bana 2025 yılında gördüğüm tüm ay fazlarını hatırlatıyor. Ne güzel bir yıl geçirdik ay gözlemleri açısından!`,
    observations: [
      'Yılın son dolunayı çok özel',
      'Kar taneleriyle büyülü manzara',
      'Tycho krateri çok belirgin',
      'Yılı güzel tamamladık'
    ]
  }
];

export const observationNotes = [
  {
    id: 1,
    date: '3 Kasım 2025',
    phase: 'Şişkin Ay',
    title: 'Mare Alanlarının Güzelliği',
    description: 'Şişkin Ay fazında Mare denilen düz alanları çok detaylı inceledim. Bu koyu renkli ovalar çok büyük ve pürüzsüz. İçlerinde çok az krater var.',
    visibility: 'Çok İyi',
    duration: '45 dakika',
    note: "Mare'ler ile highlands arasındaki renk farkı çok belirgin görünüyor."
  },
  {
    id: 2,
    date: '11 Kasım 2025',
    phase: 'Dolunay',
    title: 'Dolunay\'da Tycho Krateri',
    description: 'Bu muhteşem dolunay gecesinde Tycho kraterini keşfettim! Merkezinden çıkan ışın çizgileri çok parlak ve uzun. Sanki devasa bir örümcek ağı gibi.',
    visibility: 'Mükemmel',
    duration: '1 saat',
    note: "Tycho'nun ışın sistemi dolunayda en net şekilde görünüyor."
  },
  {
    id: 3,
    date: '20 Kasım 2025',
    phase: 'Son Dördün',
    title: 'Kraterlerin Gölge Sanatı',
    description: 'Son Dördün fazında kraterlerin gölgelerini inceledim. Terminator çizgisi boyunca gölgeler çok dramatik görünüyor. Büyük kraterlerin içindeki dağların gölgeleri uzun çizgiler oluşturuyor.',
    visibility: 'Çok İyi',
    duration: '40 dakika',
    note: 'Gölge-ışık oyunu en güzel Son Dördün fazında görülebiliyor.'
  },
  {
    id: 4,
    date: '26 Kasım 2025',
    phase: 'Yeni Ay',
    title: 'Yeni Ay Gecesi Gezegenler',
    description: 'Yeni ay gecesinde gökyüzü çok karanlık olduğu için diğer gezegenleri net gözlemledim. Jüpiter ve Saturn çok parlak görünüyordu. Ay yokken uzay çok farklı.',
    visibility: 'Gezegenler için mükemmel',
    duration: '1.5 saat',
    note: 'Ay ışığı olmadığında diğer gök cisimlerini daha iyi görebiliyoruz.'
  },
  {
    id: 5,
    date: '30 Kasım 2025',
    phase: 'Hilal',
    title: 'İlk Hilal\'de Dünya Parlaması',
    description: 'Hilal fazındayken Ay\'ın karanlık kısmının zayıfça parladığını gördüm! Bu \'Dünya Parlaması\' denilen olay. Dünya\'nın güneş ışığını Ay\'a yansıtması sonucu oluşuyormuş.',
    visibility: 'Zor',
    duration: '25 dakika',
    note: 'Dünya parlaması dürbünle çok güzel görünüyor, çıplak gözle zor.'
  },
  {
    id: 6,
    date: '7 Aralık 2025',
    phase: 'İlk Dördün',
    title: 'İlk Dördün\'de Terminator',
    description: 'İlk Dördün fazında terminator çizgisini detaylı inceledim. Bu ışık-gölge sınırında kraterlerin kenarları çok keskin görünüyor. En iyi krater gözlem zamanı!',
    visibility: 'Mükemmel',
    duration: '50 dakika',
    note: 'Terminator çizgisi boyunca tüm krater detayları mükemmel görünüyor.'
  }
];