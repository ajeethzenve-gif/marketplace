
import React from "react";
import {
  Sparkles,
  ArrowRight,
  Heart,
  
  ShoppingBag,
  ChevronDown,
} from "lucide-react";

import "../styles/Zenvefashionn.css";
import zenveHero from "../assets/logo/zenve-fashion-logo.png";

// Pet images
import img from "../assets/logo/pet-2.jpg";
import two from "../assets/logo/Raibo-dog.jpg";
import three from "../assets/logo/pet-3.jpg";
import cat from "../assets/logo/CAT.jpg";
import cat6 from "../assets/logo/pet-6.jpg";
import partydog from "../assets/logo/yem-dog.jpg";


// =====================================================
// BASE PRODUCTS
// =====================================================

const products = [
  {
    id: 1,
    tag: "RUNWAY",
    designer: "ANAYA KAUR ATELIER",
    name: "Anaya Kaur Semi Cape - Gold Edition",
    description:
      "Hand-finished cape with satin lining – Zardozi couture, New Delhi.",
    price: "₹1,350",
    oldPrice: "₹1,499",
    discount: "10% off",
    reviews: "4.2",
    reviewCount: 18,
    image:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    tag: "LIMITED",
    designer: "ANAYA KAUR ATELIER",
    name: "Anaya Lehenga Harness - Noir",
    description:
      "Featherweight harness with couture skirt – Zardozi couture, New Delhi.",
    price: "₹4,980",
    oldPrice: "₹5,999",
    discount: "17% off",
    reviews: "4.7",
    reviewCount: 47,
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    tag: "COUTURE",
    designer: "ANAYA KAUR ATELIER",
    name: "Anaya Bandhgala Jacket - Ivory",
    description:
      "Structured jacket in mulberry silk – Zardozi couture, New Delhi.",
    price: "₹4,480",
    oldPrice: "₹5,899",
    discount: "24% off",
    reviews: "4.4",
    reviewCount: 76,
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    tag: "COUTURE",
    designer: "ANAYA KAUR ATELIER",
    name: "Anaya Silk Bandana - Marigold",
    description:
      "Reversible bandana, digital-printed silk – Zardozi couture, New Delhi.",
    price: "₹4,000",
    oldPrice: "₹5,799",
    discount: "31% off",
    reviews: "4.9",
    reviewCount: 105,
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 5,
    tag: "COUTURE",
    designer: "ANAYA KAUR ATELIER",
    name: "Anaya Festive Bow Collar - Midnight Rose",
    description:
      "Festive handcrafted collar with premium detailing – Zardozi couture, New Delhi.",
    price: "₹3,530",
    oldPrice: "₹5,699",
    discount: "38% off",
    reviews: "4.6",
    reviewCount: 134,
    image:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 6,
    tag: "LIMITED",
    designer: "ANAYA KAUR ATELIER",
    name: "Anaya Monsoon Trench - Champagne",
    description:
      "Lightweight monsoon trench with luxury finish – Zardozi couture, New Delhi.",
    price: "₹3,080",
    oldPrice: "₹5,599",
    discount: "45% off",
    reviews: "4.3",
    reviewCount: 163,
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 7,
    tag: "RUNWAY",
    designer: "ANAYA KAUR ATELIER",
    name: "Anaya Knit Sweater - Emerald",
    description:
      "Soft premium knit sweater designed for statement styling.",
    price: "₹4,890",
    oldPrice: "₹5,499",
    discount: "11% off",
    reviews: "4.8",
    reviewCount: 192,
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 8,
    tag: "COUTURE",
    designer: "ANAYA KAUR ATELIER",
    name: "Anaya Anarkali Frock - Saffron",
    description:
      "Elegant anarkali silhouette with couture finishing.",
    price: "₹4,430",
    oldPrice: "₹5,399",
    discount: "18% off",
    reviews: "4.5",
    reviewCount: 221,
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 9,
    tag: "RUNWAY",
    designer: "ANAYA KAUR ATELIER",
    name: "Anaya Tuxedo Vest - Blush",
    description:
      "Tailored tuxedo vest with refined couture construction.",
    price: "₹3,970",
    oldPrice: "₹5,299",
    discount: "25% off",
    reviews: "4.2",
    reviewCount: 250,
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 10,
    tag: "LIMITED",
    designer: "ANAYA KAUR ATELIER",
    name: "Anaya Pearl Neckpiece - Onyx",
    description:
      "Statement pearl neckpiece with hand-finished detailing.",
    price: "₹3,540",
    oldPrice: "₹5,199",
    discount: "32% off",
    reviews: "4.7",
    reviewCount: 279,
    image:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 11,
    tag: "RUNWAY",
    designer: "MEHRA STUDIO",
    name: "Rohit Sherwani Cape - Noir",
    description:
      "Sculpted sherwani cape with contemporary Indian detailing.",
    price: "₹3,110",
    oldPrice: "₹5,099",
    discount: "39% off",
    reviews: "4.4",
    reviewCount: 308,
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 12,
    tag: "LIMITED",
    designer: "MEHRA STUDIO",
    name: "Rohit Lehenga Harness - Ivory",
    description:
      "Modern lehenga harness with sculpted silhouette.",
    price: "₹2,700",
    oldPrice: "₹4,999",
    discount: "46% off",
    reviews: "4.9",
    reviewCount: 337,
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 13,
    tag: "COUTURE",
    designer: "MEHRA STUDIO",
    name: "Rohit Bandhgala Jacket - Marigold",
    description:
      "Premium bandhgala jacket with modern tailoring.",
    price: "₹4,310",
    oldPrice: "₹4,899",
    discount: "12% off",
    reviews: "4.6",
    reviewCount: 366,
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 14,
    tag: "COUTURE",
    designer: "MEHRA STUDIO",
    name: "Rohit Silk Bandana - Midnight Rose",
    description:
      "Luxury silk bandana with artistic print.",
    price: "₹3,890",
    oldPrice: "₹4,799",
    discount: "19% off",
    reviews: "4.3",
    reviewCount: 395,
    image:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 15,
    tag: "RUNWAY",
    designer: "MEHRA STUDIO",
    name: "Rohit Festive Bow Collar - Champagne",
    description:
      "Festive bow collar with handcrafted premium detailing.",
    price: "₹3,480",
    oldPrice: "₹4,699",
    discount: "26% off",
    reviews: "4.8",
    reviewCount: 424,
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 16,
    tag: "LIMITED",
    designer: "MEHRA STUDIO",
    name: "Rohit Monsoon Trench - Emerald",
    description:
      "Contemporary monsoon trench with premium construction.",
    price: "₹3,080",
    oldPrice: "₹4,599",
    discount: "33% off",
    reviews: "4.5",
    reviewCount: 453,
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 17,
    tag: "RUNWAY",
    designer: "MEHRA STUDIO",
    name: "Rohit Knit Sweater - Saffron",
    description:
      "Premium knit sweater with elegant seasonal styling.",
    price: "₹2,700",
    oldPrice: "₹4,499",
    discount: "40% off",
    reviews: "4.2",
    reviewCount: 482,
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 18,
    tag: "COUTURE",
    designer: "MEHRA STUDIO",
    name: "Rohit Anarkali Frock - Blush",
    description:
      "Flowing anarkali frock with couture detailing.",
    price: "₹2,330",
    oldPrice: "₹4,399",
    discount: "47% off",
    reviews: "4.7",
    reviewCount: 511,
    image:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 19,
    tag: "RUNWAY",
    designer: "MEHRA STUDIO",
    name: "Rohit Tuxedo Vest - Onyx",
    description:
      "Minimal tuxedo vest with refined tailoring.",
    price: "₹3,740",
    oldPrice: "₹4,299",
    discount: "13% off",
    reviews: "4.4",
    reviewCount: 540,
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 20,
    tag: "LIMITED",
    designer: "MEHRA STUDIO",
    name: "Rohit Pearl Neckpiece - Gold Edition",
    description:
      "Statement neckpiece with handcrafted pearl finish.",
    price: "₹3,360",
    oldPrice: "₹4,199",
    discount: "20% off",
    reviews: "4.9",
    reviewCount: 569,
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 21,
    tag: "RUNWAY",
    designer: "HOUSE OF IYER",
    name: "Meera Sherwani Cape - Ivory",
    description:
      "Kanjeevaram-inspired sherwani cape with modern styling.",
    price: "₹2,990",
    oldPrice: "₹4,099",
    discount: "27% off",
    reviews: "4.6",
    reviewCount: 598,
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 22,
    tag: "LIMITED",
    designer: "HOUSE OF IYER",
    name: "Meera Lehenga Harness - Marigold",
    description:
      "Traditional-inspired lehenga harness with a modern finish.",
    price: "₹2,640",
    oldPrice: "₹3,999",
    discount: "34% off",
    reviews: "4.3",
    reviewCount: 627,
    image:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 23,
    tag: "RUNWAY",
    designer: "HOUSE OF IYER",
    name: "Meera Bandhgala Jacket - Midnight Rose",
    description:
      "Structured bandhgala jacket inspired by South Indian couture.",
    price: "₹2,300",
    oldPrice: "₹3,899",
    discount: "41% off",
    reviews: "4.8",
    reviewCount: 656,
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 24,
    tag: "COUTURE",
    designer: "HOUSE OF IYER",
    name: "Meera Silk Bandana - Champagne",
    description:
      "Silk bandana with elegant traditional-inspired print.",
    price: "₹1,980",
    oldPrice: "₹3,799",
    discount: "48% off",
    reviews: "4.5",
    reviewCount: 45,
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=80",
  },
];

// =====================================================
// PEOPLE CATEGORY PRODUCTS
// =====================================================

const peopleCategoryProducts = {
  Evening: [
    {
      id: "evening-1",
      tag: "21% OFF",
      designer: "Noir Bombay",
      name: "Obsidian Sequin Gown",
      description: "Luxury sequin gown for elegant evening occasions.",
      price: "₹21,999",
      oldPrice: "₹27,999",
      discount: "21% off",
      reviews: "4.5",
      reviewCount: 120,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/d215e99d-af1b-4587-b600-54a141d99635/w3.jpg",
      url: "https://zenvefashion.com/product/obsidian-sequin-gown",
    },
    {
      id: "evening-2",
      tag: "22% OFF",
      designer: "Zenve Atelier",
      name: "Midnight Silk Dress",
      description: "Elegant midnight silk dress with a refined silhouette.",
      price: "₹12,499",
      oldPrice: "₹15,999",
      discount: "22% off",
      reviews: "4.7",
      reviewCount: 145,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/d215e99d-af1b-4587-b600-54a141d99635/w3.jpg",
      url: "https://zenvefashion.com/product/midnight-silk-dress",
    },
    {
      id: "evening-3",
      tag: "23% OFF",
      designer: "Zenve Atelier",
      name: "Midnight Satin Slip Dress",
      description: "Minimal satin slip dress with a sophisticated finish.",
      price: "₹9,999",
      oldPrice: "₹12,999",
      discount: "23% off",
      reviews: "4.9",
      reviewCount: 180,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/70f5ac39-ca1e-476d-9be2-aaceaff61f92/ppl-2.jpg",
      url: "https://zenvefashion.com/product/midnight-satin-slip",
    },
    {
      id: "evening-4",
      tag: "19% OFF",
      designer: "Kanchi Weaves",
      name: "Emerald Drape Gown",
      description: "Elegant emerald drape gown with premium detailing.",
      price: "₹20,999",
      oldPrice: "₹25,999",
      discount: "19% off",
      reviews: "4.8",
      reviewCount: 165,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/f06aebff-04a8-4a63-89b8-b4eb8bbd2194/ppl-1.jpg",
      url: "https://zenvefashion.com/product/emerald-drape-gown",
    },
    {
      id: "evening-5",
      tag: "20% OFF",
      designer: "Noir Bombay",
      name: "Noir Velvet Dinner Blazer",
      description: "Premium velvet blazer designed for evening occasions.",
      price: "₹19,999",
      oldPrice: "₹24,999",
      discount: "20% off",
      reviews: "4.8",
      reviewCount: 156,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/f06aebff-04a8-4a63-89b8-b4eb8bbd2194/ppl-1.jpg",
      url: "https://zenvefashion.com/product/noir-velvet-blazer",
    },
  ],

  Everyday: [
    {
      id: "everyday-1",
      tag: "22% OFF",
      designer: "Anaya Studio",
      name: "Minimal Ivory Kurta Set",
      description: "Minimal ivory kurta set for effortless everyday styling.",
      price: "₹6,999",
      oldPrice: "₹8,999",
      discount: "22% off",
      reviews: "4.8",
      reviewCount: 132,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/4e5c24c4-a490-49ca-a2e3-83d018c6f3bf/m2.jpg",
      url: "https://zenvefashion.com/product/minimal-ivory-kurta-set",
    },
  ],

  Festive: [
    {
      id: "festive-1",
      tag: "BESTSELLER · 20% OFF",
      designer: "Kanchi Weaves",
      name: "Emerald Zari Silk Saree",
      description: "Rich emerald silk saree with elegant zari detailing.",
      price: "₹15,999",
      oldPrice: "₹19,999",
      discount: "20% off",
      reviews: "4.8",
      reviewCount: 220,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/6cc0ccd0-d5b4-441e-b1c8-cf96401610cd/w4.jpg",
      url: "https://zenvefashion.com/product/emerald-zari-saree",
    },
    {
      id: "festive-2",
      tag: "BESTSELLER · 24% OFF",
      designer: "House of Kavya",
      name: "Noir Gold Zari Lehenga",
      description: "Statement lehenga with intricate gold zari detailing.",
      price: "₹24,999",
      oldPrice: "₹32,999",
      discount: "24% off",
      reviews: "4.9",
      reviewCount: 245,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/f06aebff-04a8-4a63-89b8-b4eb8bbd2194/ppl-1.jpg",
      url: "https://zenvefashion.com/product/noir-gold-lehenga",
    },
    {
      id: "festive-3",
      tag: "25% OFF",
      designer: "Rana & Sons",
      name: "Ivory Linen Gold Kurta",
      description: "Elegant ivory linen kurta with gold detailing.",
      price: "₹8,999",
      oldPrice: "₹11,999",
      discount: "25% off",
      reviews: "4.7",
      reviewCount: 188,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/4e5c24c4-a490-49ca-a2e3-83d018c6f3bf/m2.jpg",
      url: "https://zenvefashion.com/product/ivory-linen-gold-kurta",
    },
    {
      id: "festive-4",
      tag: "22% OFF",
      designer: "Kanchi Weaves",
      name: "Black Zari Border Saree",
      description: "Classic black saree finished with a rich zari border.",
      price: "₹13,999",
      oldPrice: "₹17,999",
      discount: "22% off",
      reviews: "4.8",
      reviewCount: 210,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/6cc0ccd0-d5b4-441e-b1c8-cf96401610cd/w4.jpg",
      url: "https://zenvefashion.com/product/black-zari-border-saree",
    },
    {
      id: "festive-5",
      tag: "21% OFF",
      designer: "House of Kavya",
      name: "Gold Thread Lehenga Lite",
      description: "Lightweight festive lehenga with gold thread detailing.",
      price: "₹18,999",
      oldPrice: "₹23,999",
      discount: "21% off",
      reviews: "4.9",
      reviewCount: 198,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/865a60fa-4bf8-40f4-87e5-e0021804f810/ppl-3.jpg",
      url: "https://zenvefashion.com/product/gold-thread-lehenga-lite",
    },
    {
      id: "festive-6",
      tag: "23% OFF",
      designer: "Anaya Studio",
      name: "Gold Thread Festive Kurta",
      description: "Festive kurta with elegant gold thread embroidery.",
      price: "₹9,999",
      oldPrice: "₹12,999",
      discount: "23% off",
      reviews: "4.8",
      reviewCount: 176,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/865a60fa-4bf8-40f4-87e5-e0021804f810/ppl-3.jpg",
      url: "https://zenvefashion.com/product/gold-thread-kurta",
    },
  ],

  Monsoon: [
    {
      id: "monsoon-1",
      tag: "19% OFF",
      designer: "Noir Bombay",
      name: "Monsoon Noir Trench",
      description: "Lightweight luxury trench designed for monsoon styling.",
      price: "₹12,999",
      oldPrice: "₹15,999",
      discount: "19% off",
      reviews: "4.8",
      reviewCount: 154,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/ac2be400-0c82-436f-a9b3-4aef2e29e208/w2.jpg",
      url: "https://zenvefashion.com/product/monsoon-noir-trench",
    },
  ],

  Party: [
    {
      id: "party-1",
      tag: "17% OFF",
      designer: "Studio Meera",
      name: "Gold Piped Tuxedo Suit",
      description: "Sharp tuxedo suit with refined gold piping.",
      price: "₹23,999",
      oldPrice: "₹28,999",
      discount: "17% off",
      reviews: "4.7",
      reviewCount: 143,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/2f9aef38-f408-40e0-9f25-b48534a13426/w5.jpg",
      url: "https://zenvefashion.com/product/gold-piped-tuxedo-suit",
    },
    {
      id: "party-2",
      tag: "18% OFF",
      designer: "Anaya Studio",
      name: "Sequin Cocktail Gown",
      description: "Statement sequin gown designed for party evenings.",
      price: "₹17,999",
      oldPrice: "₹21,999",
      discount: "18% off",
      reviews: "4.5",
      reviewCount: 121,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/f06aebff-04a8-4a63-89b8-b4eb8bbd2194/ppl-1.jpg",
      url: "https://zenvefashion.com/product/sequin-cocktail-gown",
    },
  ],

  Resort: [
    {
      id: "resort-1",
      tag: "19% OFF",
      designer: "Studio Meera",
      name: "Ivory Summer Suit",
      description: "Relaxed ivory suit designed for resort styling.",
      price: "₹16,999",
      oldPrice: "₹20,999",
      discount: "19% off",
      reviews: "4.7",
      reviewCount: 118,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/ac2be400-0c82-436f-a9b3-4aef2e29e208/w2.jpg",
      url: "https://zenvefashion.com/product/ivory-summer-suit",
    },
  ],

  Wedding: [
    {
      id: "wedding-1",
      tag: "NEW · 20% OFF",
      designer: "House of Kavya",
      name: "Champagne Sequin Anarkali",
      description: "Bridal occasion anarkali with champagne sequin finish.",
      price: "₹27,999",
      oldPrice: "₹34,999",
      discount: "20% off",
      reviews: "4.8",
      reviewCount: 205,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/865a60fa-4bf8-40f4-87e5-e0021804f810/ppl-3.jpg",
      url: "https://zenvefashion.com/product/champagne-anarkali",
    },
    {
      id: "wedding-2",
      tag: "BESTSELLER · 21% OFF",
      designer: "Rana & Sons",
      name: "Midnight Bandhgala",
      description: "Elegant midnight bandhgala with wedding-ready tailoring.",
      price: "₹22,999",
      oldPrice: "₹28,999",
      discount: "21% off",
      reviews: "4.8",
      reviewCount: 190,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/70f5ac39-ca1e-476d-9be2-aaceaff61f92/ppl-2.jpg",
      url: "https://zenvefashion.com/product/midnight-bandhgala",
    },
    {
      id: "wedding-3",
      tag: "LIMITED · 20% OFF",
      designer: "Rana & Sons",
      name: "Heritage Gold Sherwani",
      description: "Traditional-inspired sherwani with heritage gold detailing.",
      price: "₹31,999",
      oldPrice: "₹39,999",
      discount: "20% off",
      reviews: "4.7",
      reviewCount: 177,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/865a60fa-4bf8-40f4-87e5-e0021804f810/ppl-3.jpg",
      url: "https://zenvefashion.com/product/heritage-gold-sherwani",
    },
    {
      id: "wedding-4",
      tag: "LIMITED · 19% OFF",
      designer: "House of Kavya",
      name: "Ivory Bridal Reception Gown",
      description: "Elegant ivory gown for bridal reception celebrations.",
      price: "₹34,999",
      oldPrice: "₹42,999",
      discount: "19% off",
      reviews: "4.5",
      reviewCount: 162,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/865a60fa-4bf8-40f4-87e5-e0021804f810/ppl-3.jpg",
      url: "https://zenvefashion.com/product/ivory-reception-gown",
    },
  ],

  Workwear: [
    {
      id: "workwear-1",
      tag: "NEW · 21% OFF",
      designer: "Studio Meera",
      name: "Ivory Power Suit",
      description: "Clean ivory power suit for polished workwear styling.",
      price: "₹18,999",
      oldPrice: "₹23,999",
      discount: "21% off",
      reviews: "4.8",
      reviewCount: 143,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/ac2be400-0c82-436f-a9b3-4aef2e29e208/w2.jpg",
      url: "https://zenvefashion.com/product/ivory-power-suit",
    },
    {
      id: "workwear-2",
      tag: "21% OFF",
      designer: "Studio Meera",
      name: "Gold Trim Power Co-ord",
      description: "Modern power co-ord with subtle gold detailing.",
      price: "₹14,999",
      oldPrice: "₹18,999",
      discount: "21% off",
      reviews: "4.5",
      reviewCount: 126,
      image:
        "https://zenvefashion.com/__l5e/assets-v1/2f9aef38-f408-40e0-9f25-b48534a13426/w5.jpg",
      url: "https://zenvefashion.com/product/gold-trim-coord",
    },
  ],
};

// =====================================================
// ALL PEOPLE PRODUCTS
// =====================================================

const allPeopleProducts = Array.from(
  new Map(
    Object.values(peopleCategoryProducts)
      .flat()
      .map((product) => [product.id, product])
  ).values()
);

// =====================================================
// PETS CATEGORY PRODUCTS
// IMPORTANT: OUTSIDE COMPONENT
// =====================================================
const petsCategoryProducts = {
  Accessories: [
    {
      id: "pet-accessories-1",
      tag: "29% OFF",
      designer: "Zenve Atelier",
      name: "Silk Bow Collar",
      description: "Elegant silk bow collar with premium finishing.",
      price: "₹999",
      oldPrice: "₹1,399",
      discount: "29% off",
      reviews: "4.5",
      reviewCount: 96,
      image: img, // ✅ correct
    },

    {
      id: "pet-accessories-2",
      tag: "18% OFF",
      designer: "Bombay Leatherworks",
      name: "Gold Hardware Leather Lead",
      description: "Premium leather lead with gold hardware.",
      price: "₹2,799",
      oldPrice: "₹3,399",
      discount: "18% off",
      reviews: "4.8",
      reviewCount: 128,
      image: two, // ✅
    },

    {
      id: "pet-accessories-3",
      tag: "20% OFF",
      designer: "Bombay Leatherworks",
      name: "Brass Buckle Leather Collar",
      description: "Classic leather collar with brass buckle.",
      price: "₹2,399",
      oldPrice: "₹2,999",
      discount: "20% off",
      reviews: "4.9",
      reviewCount: 154,
      image: three, // ✅
    },

    {
      id: "pet-accessories-4",
      tag: "21% OFF",
      designer: "Bombay Leatherworks",
      name: "Heritage Leather Collar",
      description: "Handcrafted premium leather pet collar.",
      price: "₹2,199",
      oldPrice: "₹2,799",
      discount: "21% off",
      reviews: "4.6",
      reviewCount: 117,
      image: cat, // ✅ lowercase catx
    },
  ],

  Everyday: [
    {
      id: "pet-everyday-1",
      tag: "28% OFF",
      designer: "Zenve Atelier",
      name: "Silk Zari Bandana",
      description: "Elegant zari bandana for everyday styling.",
      price: "₹1,299",
      oldPrice: "₹1,799",
      discount: "28% off",
      reviews: "4.7",
      reviewCount: 104,
      image: three,
    },

    {
      id: "pet-everyday-2",
      tag: "31% OFF",
      designer: "Tailwag Studio",
      name: "Everyday Pet Tee",
      description: "Comfortable premium cotton pet tee.",
      price: "₹899",
      oldPrice: "₹1,299",
      discount: "31% off",
      reviews: "4.6",
      reviewCount: 143,
      image: cat6,
    },

    {
      id: "pet-everyday-3",
      tag: "25% OFF",
      designer: "Zenve Atelier",
      name: "Zari Pet Scarf",
      description: "Premium zari scarf designed for pets.",
      price: "₹1,499",
      oldPrice: "₹1,999",
      discount: "25% off",
      reviews: "4.9",
      reviewCount: 132,
      image: cat6,
    },
  ],

  Festive: [
    {
      id: "pet-festive-1",
      tag: "19% OFF",
      designer: "Paws Couture",
      name: "Diwali Gold Pet Jacket",
      description: "Festive gold jacket for special occasions.",
      price: "₹4,199",
      oldPrice: "₹5,199",
      discount: "19% off",
      reviews: "4.7",
      reviewCount: 115,
      image: two,
    },

    {
      id: "pet-festive-2",
      tag: "21% OFF",
      designer: "Paws Couture",
      name: "Festive Pet Kurta",
      description: "Traditional festive kurta for pets.",
      price: "₹2,299",
      oldPrice: "₹2,899",
      discount: "21% off",
      reviews: "4.7",
      reviewCount: 101,
      image: cat6,
    },
  ],

  Monsoon: [
    {
      id: "pet-monsoon-1",
      tag: "NEW · 18% OFF",
      designer: "Tailwag Studio",
      name: "Noir Gold Pet Raincoat",
      description: "Stylish waterproof raincoat for pets.",
      price: "₹3,299",
      oldPrice: "₹3,999",
      discount: "18% off",
      reviews: "4.7",
      reviewCount: 92,
      image: two,
    },

    {
      id: "pet-monsoon-2",
      tag: "19% OFF",
      designer: "Tailwag Studio",
      name: "Monsoon Paw Poncho",
      description: "Comfortable lightweight monsoon poncho.",
      price: "₹2,599",
      oldPrice: "₹3,199",
      discount: "19% off",
      reviews: "4.8",
      reviewCount: 108,
      image: cat,
    },
  ],

  Party: [
    {
      id: "pet-party-1",
      tag: "Bestseller · 20% OFF",
      designer: "Paws Couture",
      name: "Noir Velvet Pet Tuxedo",
      description: "Luxury velvet tuxedo for party occasions.",
      price: "₹3,999",
      oldPrice: "₹4,999",
      discount: "20% off",
      reviews: "4.7",
      reviewCount: 137,
      image: partydog,
    },

    {
      id: "pet-party-2",
      tag: "Bestseller · 22% OFF",
      designer: "Paws Couture",
      name: "Royal Pet Tuxedo",
      description: "Premium royal tuxedo for stylish pets.",
      price: "₹3,499",
      oldPrice: "₹4,499",
      discount: "22% off",
      reviews: "4.9",
      reviewCount: 149,
      image: partydog,
    },

    {
      id: "pet-party-3",
      tag: "24% OFF",
      designer: "Zenve Atelier",
      name: "Evening Pet Bowtie Set",
      description: "Elegant bowtie set for evening events.",
      price: "₹1,299",
      oldPrice: "₹1,699",
      discount: "24% off",
      reviews: "4.7",
      reviewCount: 94,
      image: partydog,
    },
  ],

  Resort: [
    {
      id: "pet-resort-1",
      tag: "21% OFF",
      designer: "Anaya Studio",
      name: "Resort Pet Shirt",
      description: "Relaxed premium resort shirt for pets.",
      price: "₹1,899",
      oldPrice: "₹2,399",
      discount: "21% off",
      reviews: "4.6",
      reviewCount: 86,
      image: img,
    },
  ],

  Wedding: [
    {
      id: "pet-wedding-1",
      tag: "17% OFF",
      designer: "House of Kavya",
      name: "Pet Wedding Cape",
      description: "Elegant cape designed for pet weddings.",
      price: "₹3,899",
      oldPrice: "₹4,699",
      discount: "17% off",
      reviews: "4.6",
      reviewCount: 91,
      image: partydog,
    },
  ],

  Winter: [
    {
      id: "pet-winter-1",
      tag: "NEW · 21% OFF",
      designer: "Paws Couture",
      name: "Gold Quilted Pet Coat",
      description: "Warm quilted coat with premium finish.",
      price: "₹4,599",
      oldPrice: "₹5,799",
      discount: "21% off",
      reviews: "4.6",
      reviewCount: 103,
      image: img,
    },

    {
      id: "pet-winter-2",
      tag: "20% OFF",
      designer: "Tailwag Studio",
      name: "Cable Knit Pet Sweater",
      description: "Soft cable knit sweater for winter.",
      price: "₹2,799",
      oldPrice: "₹3,499",
      discount: "20% off",
      reviews: "4.7",
      reviewCount: 126,
      image: cat,
    },

    {
      id: "pet-winter-3",
      tag: "NEW · 22% OFF",
      designer: "Paws Couture",
      name: "Gold Embroidered Pet Jacket",
      description: "Luxury embroidered winter jacket.",
      price: "₹4,299",
      oldPrice: "₹5,499",
      discount: "22% off",
      reviews: "4.8",
      reviewCount: 112,
      image: img,
    },

    {
      id: "pet-winter-4",
      tag: "19% OFF",
      designer: "Tailwag Studio",
      name: "Alpaca Pet Jumper",
      description: "Warm and soft alpaca jumper.",
      price: "₹3,499",
      oldPrice: "₹4,299",
      discount: "19% off",
      reviews: "4.7",
      reviewCount: 97,
      image: three,
    },
  ],
};
// =====================================================
// ALL PET PRODUCTS
// IMPORTANT: AFTER petsCategoryProducts
// =====================================================

const allPetsProducts = Array.from(
  new Map(
    Object.values(petsCategoryProducts)
      .flat()
      .map((product) => [product.id, product])
  ).values()
);

// =====================================================
// TWINS CATEGORY PRODUCTS
// =====================================================

const twinsCategoryProducts = {
  Accessories: [
    {
      id: "twin-accessories-1",
      tag: "19% OFF",
      designer: "Zenve Atelier",
      name: "Twin Scarf & Bandana Set",
      description: "Matching scarf and bandana set designed for people and pets.",
      price: "₹3,499",
      oldPrice: "₹4,299",
      discount: "19% off",
      reviews: "4.7",
      reviewCount: 96,
      image: "https://zenvefashion.com/__l5e/assets-v1/e6de3605-18ea-42d5-a9f6-0c6421ccb9c2/tw-3.jpg",
      url: "https://zenvefashion.com/product/twin-scarf-bandana-set",
    },
    {
      id: "twin-accessories-2",
      tag: "19% OFF",
      designer: "Bombay Leatherworks",
      name: "Twin Gold Accessory Kit",
      description: "Coordinated gold accessory kit for a polished twin look.",
      price: "₹5,499",
      oldPrice: "₹6,799",
      discount: "19% off",
      reviews: "4.8",
      reviewCount: 108,
      image: "https://zenvefashion.com/__l5e/assets-v1/cb78e0f9-7060-4d64-b472-f613df30ffed/pt4.jpg",
      url: "https://zenvefashion.com/product/twin-gold-accessory-kit",
    },
  ],
  Evening: [
    {
      id: "twin-evening-1",
      tag: "22% OFF",
      designer: "Zenve Atelier",
      name: "Twin Noir Duo",
      description: "Elegant coordinated noir duo for evening occasions.",
      price: "₹17,999",
      oldPrice: "₹22,999",
      discount: "22% off",
      reviews: "4.9",
      reviewCount: 124,
      image: "https://zenvefashion.com/__l5e/assets-v1/833ffb30-9e3f-4eb6-868c-1e7e86bc8d78/hero.jpg",
      url: "https://zenvefashion.com/product/twin-noir-duo",
    },
    {
      id: "twin-evening-2",
      tag: "17% OFF",
      designer: "Noir Bombay",
      name: "Twin Evening Noir Set",
      description: "Refined coordinated evening set with a luxe noir finish.",
      price: "₹24,999",
      oldPrice: "₹29,999",
      discount: "17% off",
      reviews: "4.7",
      reviewCount: 113,
      image: "https://zenvefashion.com/__l5e/assets-v1/becf9a57-d961-4ef3-8857-a2fe60e4147a/tw-1.jpg",
      url: "https://zenvefashion.com/product/twin-evening-noir",
    },
  ],
  Everyday: [
    {
      id: "twin-everyday-1",
      tag: "21% OFF",
      designer: "Studio Meera",
      name: "Twin Everyday Knit Set",
      description: "Comfortable coordinated knit set for everyday styling.",
      price: "₹7,499",
      oldPrice: "₹9,499",
      discount: "21% off",
      reviews: "4.8",
      reviewCount: 109,
      image: "https://zenvefashion.com/__l5e/assets-v1/becf9a57-d961-4ef3-8857-a2fe60e4147a/tw-1.jpg",
      url: "https://zenvefashion.com/product/twin-everyday-knit",
    },
    {
      id: "twin-everyday-2",
      tag: "22% OFF",
      designer: "Studio Meera",
      name: "Twin Everyday Edit",
      description: "Relaxed twin styling with a clean contemporary finish.",
      price: "₹6,999",
      oldPrice: "₹8,999",
      discount: "22% off",
      reviews: "4.6",
      reviewCount: 92,
      image: "https://zenvefashion.com/__l5e/assets-v1/f7769750-fde0-44c8-87b2-c9656d8c5e0b/tw2.jpg",
      url: "https://zenvefashion.com/product/twin-everyday-edit",
    },
  ],
  Festive: [
    {
      id: "twin-festive-1",
      tag: "NEW · 22% OFF",
      designer: "Rana & Sons",
      name: "Twin Ivory Kurta Duo",
      description: "Festive ivory kurta duo with refined traditional detailing.",
      price: "₹13,999",
      oldPrice: "₹17,999",
      discount: "22% off",
      reviews: "4.5",
      reviewCount: 97,
      image: "https://zenvefashion.com/__l5e/assets-v1/f7769750-fde0-44c8-87b2-c9656d8c5e0b/tw2.jpg",
      url: "https://zenvefashion.com/product/twin-ivory-kurta-duo",
    },
    {
      id: "twin-festive-2",
      tag: "TWIN EDIT · 21% OFF",
      designer: "House of Kavya",
      name: "Twin Black & Gold Festive Duo",
      description: "Statement black and gold festive twin set.",
      price: "₹18,999",
      oldPrice: "₹23,999",
      discount: "21% off",
      reviews: "4.8",
      reviewCount: 118,
      image: "https://zenvefashion.com/__l5e/assets-v1/fc538541-2d39-42b4-a0d2-f40e42b2c158/tw-2.jpg",
      url: "https://zenvefashion.com/product/twin-black-gold-festive",
    },
    {
      id: "twin-festive-3",
      tag: "TWIN EDIT · 27% OFF",
      designer: "House of Kavya",
      name: "Twin Festive Set - Black & Gold",
      description: "Coordinated festive set with elegant black and gold detailing.",
      price: "₹15,999",
      oldPrice: "₹21,999",
      discount: "27% off",
      reviews: "5.0",
      reviewCount: 126,
      image: "https://zenvefashion.com/__l5e/assets-v1/becf9a57-d961-4ef3-8857-a2fe60e4147a/tw-1.jpg",
      url: "https://zenvefashion.com/product/twin-festive-set",
    },
  ],
  Monsoon: [
    {
      id: "twin-monsoon-1",
      tag: "22% OFF",
      designer: "Tailwag Studio",
      name: "Twin Monsoon Duo",
      description: "Coordinated monsoon-ready twin duo with a lightweight finish.",
      price: "₹8,999",
      oldPrice: "₹11,499",
      discount: "22% off",
      reviews: "4.6",
      reviewCount: 89,
      image: "https://zenvefashion.com/__l5e/assets-v1/a8c07b8f-1a6b-4ec1-a4a4-30158428c7a0/pt6.jpg",
      url: "https://zenvefashion.com/product/twin-monsoon-duo",
    },
  ],
  Party: [
    {
      id: "twin-party-1",
      tag: "19% OFF",
      designer: "Anaya Studio",
      name: "Twin Diwali Gala Set",
      description: "Festive party-ready gala set for coordinated celebrations.",
      price: "₹20,999",
      oldPrice: "₹25,999",
      discount: "19% off",
      reviews: "4.6",
      reviewCount: 103,
      image: "https://zenvefashion.com/__l5e/assets-v1/e6de3605-18ea-42d5-a9f6-0c6421ccb9c2/tw-3.jpg",
      url: "https://zenvefashion.com/product/twin-diwali-gala",
    },
  ],
  Resort: [
    {
      id: "twin-resort-1",
      tag: "20% OFF",
      designer: "Anaya Studio",
      name: "Twin Resort Linen Set",
      description: "Relaxed linen twin set for resort and holiday styling.",
      price: "₹11,999",
      oldPrice: "₹14,999",
      discount: "20% off",
      reviews: "4.7",
      reviewCount: 94,
      image: "https://zenvefashion.com/__l5e/assets-v1/f7769750-fde0-44c8-87b2-c9656d8c5e0b/tw2.jpg",
      url: "https://zenvefashion.com/product/twin-resort-linen",
    },
  ],
  Wedding: [
    {
      id: "twin-wedding-1",
      tag: "LIMITED · 17% OFF",
      designer: "House of Kavya",
      name: "Twin Wedding Edit",
      description: "Luxury coordinated wedding edit with elegant occasion detailing.",
      price: "₹38,999",
      oldPrice: "₹46,999",
      discount: "17% off",
      reviews: "4.7",
      reviewCount: 121,
      image: "https://zenvefashion.com/__l5e/assets-v1/f16bcd5b-4c11-4e09-858d-38f836058af0/tw1.jpg",
      url: "https://zenvefashion.com/product/twin-wedding-edit",
    },
  ],
  Winter: [
    {
      id: "twin-winter-1",
      tag: "23% OFF",
      designer: "Tailwag Studio",
      name: "Twin Winter Warmers",
      description: "Coordinated winter layers designed for warm seasonal styling.",
      price: "₹9,999",
      oldPrice: "₹12,999",
      discount: "23% off",
      reviews: "4.9",
      reviewCount: 134,
      image: "https://zenvefashion.com/__l5e/assets-v1/fc538541-2d39-42b4-a0d2-f40e42b2c158/tw-2.jpg",
      url: "https://zenvefashion.com/product/twin-winter-warmers",
    },
  ],
};

const allTwinsProducts = Array.from(
  new Map(
    Object.values(twinsCategoryProducts)
      .flat()
      .map((product) => [product.id, product])
  ).values()
);

// =====================================================
// DESIGNERS
// =====================================================

const designers = [
  {
    name: "Anaya Kaur Atelier",
    text: "Zardozi couture - New Delhi",
  },
  {
    name: "Mehra Studio",
    text: "Sculpted silhouettes - Mumbai",
  },
  {
    name: "House of Iyer",
    text: "Kanjeevaram weaves - Chennai",
  },
  {
    name: "Sen & Sons",
    text: "Hand-block jamdani - Kolkata",
  },
  {
    name: "Zoya Rahman",
    text: "Pearl embellishment - Hyderabad",
  },
  {
    name: "Shah Bespoke",
    text: "Bandhani modern - Ahmedabad",
  },
];

// =====================================================
// CATEGORY DATA
// =====================================================

const categories = {
  People: [
    "All",
    "Evening",
    "Everyday",
    "Festive",
    "Monsoon",
    "Party",
    "Resort",
    "Wedding",
    "Workwear",
  ],

  Pets: [
    "All",
    "Accessories",
    "Everyday",
    "Festive",
    "Monsoon",
    "Party",
    "Resort",
    "Wedding",
    "Winter",
  ],

  Twins: [
    "All",
    "Accessories",
    "Evening",
    "Everyday",
    "Festive",
    "Monsoon",
    "Party",
    "Resort",
    "Wedding",
    "Winter",
  ],
};

// =====================================================
// COMPONENT
// =====================================================

function Zenvefashion() {
  const [selectedCollection, setSelectedCollection] = React.useState("All");
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  // ===================================================
  // COLLECTION CLICK
  // ===================================================

  const handleCollectionClick = (collection) => {
    setSelectedCollection(collection);
    setSelectedCategory("All");
  };

  // ===================================================
  // HERO BUTTONS
  // ===================================================

  const handleExplore = () => {
    document.getElementById("zenve-runway")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleDesigners = () => {
    document.getElementById("zenve-designers")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // ===================================================
  // CATEGORY CLICK
  // ===================================================

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // ===================================================
  // CURRENT PRODUCTS
  // ===================================================

  let currentProducts = products;

  if (selectedCollection === "People") {
    if (selectedCategory === "All") {
      currentProducts = allPeopleProducts;
    } else {
      currentProducts =
        peopleCategoryProducts[selectedCategory] || [];
    }
  }

  if (selectedCollection === "Pets") {
    if (selectedCategory === "All") {
      currentProducts = allPetsProducts;
    } else {
      currentProducts =
        petsCategoryProducts[selectedCategory] || [];
    }
  }

  if (selectedCollection === "Twins") {
    if (selectedCategory === "All") {
      currentProducts = allTwinsProducts;
    } else {
      currentProducts = twinsCategoryProducts[selectedCategory] || [];
    }
  }

  // ===================================================
  // PRODUCT CLICK
  // ===================================================

  const handleProductClick = (product) => {
    if (product.url) {
      window.open(
        product.url,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  // ===================================================
  // RETURN
  // ===================================================

  return (
    <div className="zenve-fashion-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="zenve-hero">
        <div className="zenve-hero-container">

          {/* LEFT */}

          <div className="zenve-hero-content">

            <div className="zenve-exclusive">
              <Sparkles size={15} />

              <span>
                EXCLUSIVE DROP
              </span>
            </div>

            <h1>
              Zenve Fashion
            </h1>

            <h2>
              Style without Limits
            </h2>

            <p>
              200 couture pieces from 20 Indian designer
              houses — matching capes, harness lehengas,
              bandhalas and hand-finished collars, cut for
              pets and the people who walk beside them.
            </p>

            <div className="zenve-hero-buttons">

              <button
                className="zenve-primary-btn"
                onClick={handleExplore}
              >
                Explore the runway
                <ArrowRight size={17} />
              </button>


            </div>

            {/* STATS */}

            <div className="zenve-stats">

              <div className="zenve-stat">
                <strong>
                  200
                </strong>

                <span>
                  RUNWAY PIECES
                </span>
              </div>

              <div className="zenve-stat">
                <strong>
                  20
                </strong>

                <span>
                  DESIGNER HOUSES
                </span>
              </div>

              <div className="zenve-stat">
                <strong>
                  100%
                </strong>

                <span>
                  MADE IN INDIA
                </span>
              </div>

            </div>

          </div>

          {/* RIGHT */}


          <div className="zenve-hero-image">
            <img
              src={zenveHero}
              alt="Zenve Fashion"
              className="zenve-hero-img"
            />
          </div>

        </div>
      </section>

      {/* =================================================
          RUNWAY
      ================================================= */}

      <section
        className="zenve-runway-section"
        id="zenve-runway"
      >

        <div className="zenve-section-container">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="zenve-runway-header">

            <div>

              <h2>
                The Runway
              </h2>

              <p>
                Showing {currentProducts.length} pieces
              </p>

            </div>

            {/* FILTERS */}

            <div className="zenve-filter-wrapper">

              <div className="zenve-filters">

                {/* ALL */}

                <button
                  className={
                    selectedCollection === "All"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    handleCollectionClick("All")
                  }
                >
                  All collections
                </button>

                {/* PEOPLE */}

                <button
                  className={
                    selectedCollection === "People"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    handleCollectionClick("People")
                  }
                >
                  People
                  <ChevronDown size={15} />
                </button>

                {/* PETS */}

                <button
                  className={
                    selectedCollection === "Pets"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    handleCollectionClick("Pets")
                  }
                >
                  Pets
                  <ChevronDown size={15} />
                </button>

                {/* TWINS */}

                <button
                  className={
                    selectedCollection === "Twins"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    handleCollectionClick("Twins")
                  }
                >
                  Twins
                  <ChevronDown size={15} />
                </button>

              </div>

              {/* =================================================
                  CATEGORY POPUP
              ================================================= */}

              {selectedCollection !== "All" && (
                <div className="zenve-category-popup">

                  <div className="zenve-category-title">
                    {selectedCollection} categories
                  </div>

                  <div className="zenve-category-list">

                    {categories[selectedCollection].map(
                      (category) => (
                        <button
                          key={category}
                          className={
                            selectedCategory === category
                              ? "category-active"
                              : ""
                          }
                          onClick={() =>
                            handleCategoryClick(category)
                          }
                        >
                          {category}
                        </button>
                      )
                    )}

                  </div>

                </div>
              )}

            </div>

          </div>

          {/* =================================================
              SELECTED FILTER
          ================================================= */}

          {selectedCollection !== "All" && (
            <div className="zenve-selected-filter">

              <span>
                Collection:
              </span>

              <strong>
                {selectedCollection}
              </strong>

              <span>
                /
              </span>

              <span>
                Category:
              </span>

              <strong>
                {selectedCategory}
              </strong>

            </div>
          )}

          {/* =================================================
              PEOPLE ALL INFO
          ================================================= */}

          {selectedCollection === "People" &&
            selectedCategory === "All" && (
              <div className="zenve-selected-filter">

                <span>
                  Showing all People styles:
                </span>

                <strong>
                  {currentProducts.length} products
                </strong>

              </div>
            )}

          {/* =================================================
              PETS ALL INFO
          ================================================= */}

          {selectedCollection === "Pets" &&
            selectedCategory === "All" && (
              <div className="zenve-selected-filter">

                <span>
                  Showing all Pets styles:
                </span>

                <strong>
                  {currentProducts.length} products
                </strong>

              </div>
            )}

          {/* =================================================
              TWINS ALL INFO
          ================================================= */}

          {selectedCollection === "Twins" &&
            selectedCategory === "All" && (
              <div className="zenve-selected-filter">

                <span>
                  Showing all Twins styles:
                </span>

                <strong>
                  {currentProducts.length} products
                </strong>

              </div>
            )}

          {/* =================================================
              PRODUCTS
          ================================================= */}

          <div className="zenve-product-grid">

            {currentProducts.map((product) => (

              <div
                className="zenve-product-card"
                key={product.id}
              >

                {/* PRODUCT IMAGE */}

                <div
                  className="zenve-product-image"
                  onClick={() =>
                    handleProductClick(product)
                  }
                  style={{
                    cursor: product.url
                      ? "pointer"
                      : "default",
                  }}
                >

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <span className="zenve-product-tag">
                    {product.tag}
                  </span>

                  <button
                    className="zenve-heart"
                    aria-label="Add to wishlist"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >
                    <Heart size={17} />
                  </button>

                </div>

                {/* DETAILS */}

                <div className="zenve-product-details">

                  <span className="zenve-designer-name">
                    {product.designer}
                  </span>

                  <h3>
                    {product.name}
                  </h3>

                  <p className="zenve-product-description">
                    {product.description}
                  </p>

                  {/* PET COLOURS */}

                  {product.colours && (
                    <div className="zenve-product-colours">
                      {product.colours}
                    </div>
                  )}

                  {/* RATING */}

                  <div className="zenve-rating">

                    <span>
                      ★
                    </span>

                    <strong>
                      {product.reviews}
                    </strong>

                    <small>
                      · {product.reviewCount} reviews
                    </small>

                  </div>

                  {/* EDITION */}

                  <div className="zenve-edition">

                    EDITION{" "}

                    {typeof product.id === "number"
                      ? String(product.id).padStart(
                        3,
                        "0"
                      )
                      : product.id
                        .toUpperCase()}

                    {" / 200"}

                  </div>

                  {/* PRICE */}

                  <div className="zenve-price-row">

                    <div>

                      <strong>
                        {product.price}
                      </strong>

                      <del>
                        {product.oldPrice}
                      </del>

                    </div>

                    <span>
                      {product.discount}
                    </span>

                  </div>

                  {/* BASKET */}

                  <button
                    className="zenve-basket-btn"
                    onClick={() =>
                      handleProductClick(product)
                    }
                  >

                    <ShoppingBag size={15} />

                    Add to basket

                  </button>

                </div>

              </div>

            ))}

          </div>

          {/* =================================================
              NO PRODUCTS
          ================================================= */}

          {currentProducts.length === 0 && (
            <div className="zenve-no-products">

              <h3>
                No products found
              </h3>

              <p>
                More styles are coming soon.
              </p>

            </div>
          )}

          {/* =================================================
              LOAD MORE
          ================================================= */}

          <div className="zenve-load-more">

            <button className="zenve-load-more-btn">

              Load more pieces

              <ArrowRight size={16} />

            </button>

          </div>

        </div>

      </section>


    </div>
  );
}

export default Zenvefashion;