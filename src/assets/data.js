// src/assets/data.js
export const features = [
  { iconName: "ArrowUpCircle", iconColor: "text-purple-500", title: "Easy File Upload", description: "Quickly upload your files with our intuitive drag-and-drop interface." },
  { iconName: "Shield", iconColor: "text-green-500", title: "Secure Storage", description: "Your files are encrypted and stored securely in our cloud infrastructure." },
  { iconName: "Share2", iconColor: "text-blue-500", title: "Simple Sharing", description: "Share files with anyone using secure links that you control." },
  { iconName: "CreditCard", iconColor: "text-orange-500", title: "Flexible Credits", description: "Pay only for what you use with our credit-based system." },
  { iconName: "FileText", iconColor: "text-red-500", title: "File Management", description: "Organize, preview, and manage your files from any device." },
  { iconName: "Clock", iconColor: "text-indigo-500", title: "Transaction History", description: "Keep track of all your credit purchases and usage." },
];

export const pricingPlans = [
  {
    name: "Free",
    price: 0,
    currency: "฿",
    period: "/mo",
    description: "Perfect for getting started",
    features: ["5 file uploads", "Basic file sharing", "7-day file retention", "Email support"],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Premium",
    price: 500,
    currency: "฿",
    period: "/mo",
    description: "For individuals with larger needs",
    features: ["500 file uploads", "Advanced file sharing", "30-day file retention", "Priority email support", "File analytics"],
    cta: "Go Premium",
    highlighted: true,
  },
  {
    name: "Ultimate",
    price: 2500,
    currency: "฿",
    period: "/mo",
    description: "For teams and businesses",
    features: ["5000 file uploads", "Team sharing capabilities", "Unlimited file retention", "24/7 priority support", "API access"],
    cta: "Go Ultimate",
    highlighted: false,
  },
];

export const testimonials = [
  {
    name: "Sedthawut Kaewka",
    role: "Java Developer",
    company: "KBANK (Kasikornbank)",
    img: "/images/kk.jpg", 
    quote: "CloudShare has transformed how our team collaborates on creative assets.",
    rating: 5,
  },
  {
    name: "Jantrathip Khankhajon",
    role: "Nutritionist",
    company: "Bangkok Hospital",
    img: "/images/nn.jpg",
    quote: "As a freelancer, I need to share large design files easily and securely.",
    rating: 5,
  },
  {
    name: "Prachanon HongHnong",
    role: "Engineer",
    company: "SCG",
    img: "/images/rr.jpg",
    quote: "Convenient for an engineer like me. Easy to use, but requires a bit of learning.",
    rating: 3,
  },
];
