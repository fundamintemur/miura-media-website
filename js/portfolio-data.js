// Tüm portfolio resimleri BURADA yönetilir.
// Yeni iş eklemek için sadece buraya bir satır eklemen yeterli —
// HTML veya CSS'e dokunmana gerek YOK.
const PORTFOLIO_ITEMS = [
  { file: "g1.webp",  category: "weddings",   caption: "WEDDING — full-length gown" },
  { file: "g2.webp",  category: "weddings",   caption: "WEDDING — Baha'i temple" },
  { file: "g3.webp",  category: "weddings",   caption: "EVENT — candlelit table" },
  { file: "g4.webp",  category: "restaurant", caption: "RESTAURANT — burger & beer" },
  { file: "g5.webp",  category: "content",    caption: "SOCIAL — cocktail campaign" },
  { file: "g6.webp",  category: "content",    caption: "CONTENT — cocktail flight" },
  { file: "g7.webp",  category: "content",    caption: "CONTENT — seasonal cocktail" },
  { file: "g8.webp",  category: "weddings",   caption: "EVENT — celebration" },
  { file: "g9.webp",  category: "weddings",   caption: "EVENT — bridal portrait" },
  { file: "g10.webp", category: "weddings",   caption: "WEDDING — bridal bouquet" },
  { file: "g11.webp", category: "weddings",   caption: "WEDDING — family portrait" },
  { file: "g12.webp", category: "weddings",   caption: "WEDDING — proposal" },
  { file: "g13.webp", category: "weddings",   caption: "WEDDING — engagement" },
  { file: "g14.webp", category: "weddings",   caption: "WEDDING — editorial motion" },
  { file: "g15.webp", category: "weddings",   caption: "WEDDING — gown detail" },
  { file: "g16.webp", category: "weddings",   caption: "WEDDING — bridal editorial" },
  { file: "g17.webp", category: "content",    caption: "MATERNITY — golden hour portrait" },
   {file: "g18.webp", category: "weddings",   caption: "WEDDING — bridal editorial" },
 { file: "mia-beach-1.webp", category: "content", caption: "EDITORIAL — beach portrait", position: "center 0%" },
{ file: "mia-beach-2.webp", category: "content", caption: "EDITORIAL — golden hour close-up", position: "center 15%" },

  // ↓↓↓ yeni resim eklemek isterse örnek, tek satır kopyala-yapıştır yeter ↓↓↓
  // { file: "g19.webp", category: "realestate", caption: "REAL ESTATE — living room" },
];

