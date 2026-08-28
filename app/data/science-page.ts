import {
  PiFlaskLight,
  PiShareNetworkLight,
  PiGearLight,
  PiMicroscopeLight,
  PiTestTubeLight,
  PiClipboardTextLight,
  PiMagnifyingGlassLight,
  PiLeafLight,
  PiShieldCheckLight,
  PiCubeLight,
  PiUsersThreeLight,
  PiScalesLight,
} from "react-icons/pi";

export const HERO_BADGES = [
  { icon: PiFlaskLight, label: "Science Backed", sublabel: "Formulations" },
  { icon: PiShareNetworkLight, label: "Transparent", sublabel: "Ingredients" },
  { icon: PiGearLight, label: "Effective &", sublabel: "Safe Nutrition" },
];

export const OUR_PROMISE = [
  "No Banned Substances",
  "No Hidden Ingredients",
  "No Artificial Fillers",
  "Complete Transparency",
];

export const INGREDIENTS = [
  {
    name: "Whey Protein",
    description: "High quality protein for muscle growth & recovery.",
    image: "/ingredients/whey-protein.jpg",
  },
  {
    name: "Ashwagandha",
    description: "Helps reduce stress & improve strength.",
    image: "/ingredients/ashwagandha.jpg",
  },
  {
    name: "Creatine Monohydrate",
    description: "Improves performance, strength & lean mass.",
    image: "/ingredients/creatine.jpg",
  },
  {
    name: "Omega 3 (Fish Oil)",
    description: "Supports heart health, brain & joint function.",
    image: "/ingredients/omega-3.jpg",
  },
  {
    name: "Vitamins & Minerals",
    description: "Essential nutrients for daily wellness.",
    image: "/ingredients/vitamins.jpg",
  },
  {
    name: "Probiotics",
    description: "Supports gut health & better absorption.",
    image: "/ingredients/probiotics.jpg",
  },
];

export const SCIENCE_FEATURES = [
  {
    icon: PiMicroscopeLight,
    title: "Research Driven",
    subtitle:
      "Our formulas are developed after extensive research and clinical studies for real results.",
  },
  {
    icon: PiTestTubeLight,
    title: "Expert Formulated",
    subtitle:
      "By nutrition experts and scientists to ensure the right ingredients in the right amounts.",
  },
  {
    icon: PiClipboardTextLight,
    title: "Clinically Studied",
    subtitle:
      "Many of our ingredients are clinically studied for safety and effectiveness.",
  },
  {
    icon: PiMagnifyingGlassLight,
    title: "Real Results",
    subtitle:
      "Tested by thousands of customers to deliver visible and measurable results.",
  },
];

export const FORMULATION_STEPS = [
  {
    icon: PiLeafLight,
    title: "Ingredient Selection",
    subtitle:
      "We source the finest raw ingredients from trusted global suppliers.",
  },
  {
    icon: PiMagnifyingGlassLight,
    title: "Quality Testing",
    subtitle:
      "Every ingredient is tested for purity, potency and safety in NABL accredited labs.",
  },
  {
    icon: PiTestTubeLight,
    title: "Expert Formulation",
    subtitle:
      "Ingredients are combined in optimal ratios for maximum benefits.",
  },
  {
    icon: PiShieldCheckLight,
    title: "In-House Testing",
    subtitle:
      "Finished products are tested for heavy metals, microbials & banned substances.",
  },
  {
    icon: PiCubeLight,
    title: "Trusted By You",
    subtitle: "Only after passing all tests, products are approved for you.",
  },
];

export const CERTIFICATIONS = [
  {
    label: "GMP",
    sublabel: "Certified",
    description: "Good Manufacturing Practices",
  },
  {
    label: "ISO",
    sublabel: "22000:2018",
    description: "Food Safety Management",
  },
  {
    label: "HACCP",
    sublabel: "Certified",
    description: "Hazard Analysis Critical Control Point",
  },
  { label: "LAB", sublabel: "TESTED", description: "For Purity & Potency" },
  {
    label: "CLEAN",
    sublabel: "LABEL",
    description: "No Artificial Colors, Flavors or Fillers",
  },
  { label: "CRUELTY", sublabel: "FREE", description: "Not Tested on Animals" },
];

export const TRANSPARENCY_POINTS = [
  "Full Ingredient Disclosure",
  "No Proprietary Blends",
  "No Hidden Ingredients",
];

export const CTA_STATS = [
  { icon: PiUsersThreeLight, value: "1M+", label: "Trusted by Customers" },
  { icon: PiShieldCheckLight, value: "100%", label: "Safe & Effective" },
  { icon: PiScalesLight, value: "Real", label: "Ingredients, Real Results" },
];
