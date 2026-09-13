import React from 'react';
import { X, Shield, FileText, RefreshCw, Cookie } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'refund' | 'cookies' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const contentMap = {
    privacy: {
      title: "Maxfiylik Siyosati (Privacy Policy)",
      icon: Shield,
      updated: "2026-09-01",
      body: `ASTRAFOLIO foydalanuvchilarining shaxsiy ma'lumotlari daxlsizligini qat'iy himoya qiladi.

1. Yig'iladigan ma'lumotlar:
Platformada ro'yxatdan o'tishda foydalanuvchi ismi, elektron pochta manzili, telefon raqami va server boshqaruvi uchun zarur bo'lgan texnik parametrlar (IP manzil, brauzer turi, sessiya loglari) saqlanadi.

2. Ma'lumotlarning ishlatilishi:
Ushbu ma'lumotlar faqatgina hosting xizmatlarini ko'rsatish, hisob-kitoblarni amalga oshirish, xavfsizlik monitoringi (WAF, DDoS filtrlash) va texnik qo'llab-quvvatlash uchun ishlatiladi. Foydalanuvchi ma'lumotlari uchinchi shaxslarga sotilmaydi yoki noqonuniy berilmaydi.

3. Ma'lumotlar bazasi va fayllar xavfsizligi:
Barcha mijoz saytlari, ma'lumotlar bazalari va S3 zaxira nusxalari AES-256 va TLS 1.3 shifrlash standartlari bilan himoyalangan Tier-III ma'lumotlar markazlarida saqlanadi.

4. Aloqa:
Maxfiylik bo'yicha har qanday savollar uchun: privacy@astrafolio.uz`,
    },
    terms: {
      title: "Foydalanish Shartlari (Terms of Service)",
      icon: FileText,
      updated: "2026-09-01",
      body: `ASTRAFOLIO Cloud Hosting va Developer Platform xizmatlaridan foydalanish qoidalari:

1. Xizmatlarni taqdim etish:
Astrafolio foydalanuvchiga tanlangan tarif doirasida vebsayt hostingi, domen, DNS, ma'lumotlar bazasi va CI/CD resurslarini taqdim etadi. Xizmatlar 99.9% uptime SLA kafolati bilan ishlaydi.

2. Taqiqlangan harakatlar:
Klaster serverlarida quyidagi faoliyatlar qat'iyan taqiqlanadi va hisobning darhol to'xtatilishiga (ban) sabab bo'ladi:
- Kriptovalyuta qazib olish (mining)
- DDoS hujumlarini uyushtirish yoki botnet boshqarish
- Zararli dasturlar (malware, phishing, spam) tarqatish
- O'zbekiston Respublikasi va xalqaro qonunchiligiga zid kontentlar joylashtirish

3. To'lovlar va uzaytirish:
Obunalar oylik yoki yillik asosda Payme, Click yoki Uzcard/Humo orqali amalga oshiriladi. To'lov amalga oshirilgach xizmat bir zumda avtomatik faollashadi.

4. Mas'uliyat:
Foydalanuvchi o'z login ma'lumotlari va 2FA kalitlarining maxfiyligi uchun to'liq javobgardir.`,
    },
    refund: {
      title: "Mablag'ni Qaytarish Siyosati (Refund Policy)",
      icon: RefreshCw,
      updated: "2026-09-01",
      body: `ASTRAFOLIO o'z xizmatlari sifatiga 100% ishonadi va 14 kunlik kafolat taqdim etadi.

1. 14 kunlik kafolat:
Agar siz xizmat sifatidan (server tezligi, boshqaruv qulayligi, uptime) qoniqmasangiz, hosting xarid qilingan kundan boshlab 14 kun ichida to'lovni 100% to'liq qaytarib olishingiz mumkin.

2. Qaytarib berilmaydigan xizmatlar:
- Ro'yxatdan o'tkazilgan xalqaro va milliy domen nomlari (.uz, .com va h.k.) reyestr qoidalariga ko'ra bekor qilinmaydi va qaytarilmaydi.
- Maxsus buyurtma qilingan SSL EV sertifikatlari.

3. Qaytarish jarayoni:
Murojaat 'Tiketlar' bo'limi orqali qabul qilinadi va 3 ish kuni ichida dastlab to'langan to'lov usuliga (Payme/Click kartasiga) qaytariladi.`,
    },
    cookies: {
      title: "Cookie Siyosati (Cookie Policy)",
      icon: Cookie,
      updated: "2026-09-01",
      body: `Platformada cookie fayllaridan foydalanish tartibi:

1. Zaruriy cookie'lar:
Tizimga kirish (autentifikatsiya sessiyasi), xavfsizlik (CSRF tokenlar) va til sozlamalarini saqlab qolish uchun zaruriy cookie'lar ishlatiladi.

2. Analitika cookie'lari:
Dashboard yuklanish tezligi va xatoliklarni aniqlash maqsadida anonim texnik ko'rsatkichlar qayd etiladi. Shaxsiy qidiruvlar uchinchi tomon reklama tizimlariga uzatilmaydi.

3. Cookie'larni boshqarish:
Foydalanuvchi o'z brauzer sozlamalari orqali cookie'larni istalgan payt tozalashi yoki taqiqlashi mumkin. Biroq bu holda avtomatik avtorizatsiya vaqtincha ishlamasligi mumkin.`,
    },
  };

  const current = contentMap[type];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0b101d] border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl shadow-cyan-500/10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{current.title}</h3>
              <p className="text-[11px] text-slate-400">Oxirgi yangilanish: {current.updated}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto text-sm text-slate-300 space-y-4 leading-relaxed whitespace-pre-line font-normal">
          {current.body}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
};
