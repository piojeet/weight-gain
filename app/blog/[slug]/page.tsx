// @ts-nocheck
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { IconType } from "react-icons";
import { FiArrowRight, FiBookOpen, FiCalendar, FiCheck, FiChevronRight, FiClock, FiGlobe, FiHeart, FiLink, FiMessageCircle, FiShield, FiStar, FiUser } from "react-icons/fi";
import { PRODUCTS } from "@/app/data/products";
import RelatedArticleRouter from "@/components/blog/RelatedArticleRouter";

const primaryArticle = {
  slug: "how-to-build-a-balanced-diet-for-better-health",
  title: "How to Build a Balanced Diet for Better Health",
  category: "Nutrition",
  date: "May 20, 2024",
  read: "5 min read",
  image: "/categories/mass-gainer.jpg",
  intro: "A balanced diet is essential for maintaining good health, supporting growth, and preventing chronic diseases. It provides your body with the right amount of macronutrients, micronutrients, and calories it needs to function properly.",
};
const articleCatalog = [
  primaryArticle,
  { slug: "whey-protein-benefits-uses-and-side-effects", title: "Whey Protein: Benefits, Uses and Side Effects", category: "Fitness", date: "May 18, 2024", read: "6 min read", image: "/categories/mass-gainer.jpg", intro: "Whey protein is a convenient, high-quality source of protein that can support recovery, strength, and your everyday nutrition goals." },
  { slug: "top-10-high-protein-foods-you-should-eat-daily", title: "Top 10 High Protein Foods You Should Eat Daily", category: "Nutrition", date: "May 15, 2024", read: "4 min read", image: "/categories/mass-gainer.jpg", intro: "Adding protein-rich whole foods to your meals is a simple way to support energy, muscle maintenance, and a balanced diet." },
  { slug: "5-simple-habits-for-a-healthier-lifestyle", title: "5 Simple Habits for a Healthier Lifestyle", category: "Wellness", date: "May 12, 2024", read: "5 min read", image: "/categories/mass-gainer.jpg", intro: "Small, repeatable habits can create lasting improvements in your energy, recovery, and overall wellbeing." },
  { slug: "creatine-monohydrate-benefits-dosage-how-it-works", title: "Creatine Monohydrate: Benefits, Dosage & How It Works", category: "Supplements", date: "May 10, 2024", read: "6 min read", image: "/categories/mass-gainer.jpg", intro: "Creatine monohydrate is one of the most researched supplements for supporting strength and high-intensity exercise." },
  { slug: "pre-post-workout-nutrition-what-to-eat-and-when", title: "Pre & Post Workout Nutrition: What to Eat and When", category: "Nutrition", date: "May 8, 2024", read: "5 min read", image: "/categories/mass-gainer.jpg", intro: "The right meal before and after training can help you feel stronger during exercise and recover well afterward." },
  { slug: "muscle-recovery-7-tips-to-recover-faster", title: "Muscle Recovery: 7 Tips to Recover Faster", category: "Fitness", date: "May 5, 2024", read: "4 min read", image: "/categories/mass-gainer.jpg", intro: "Training progress depends on recovery. Use these practical strategies to help your body repair and adapt." },
  { slug: "importance-of-sleep-for-muscle-growth", title: "The Importance of Sleep for Muscle Growth", category: "Wellness", date: "May 2, 2024", read: "4 min read", image: "/categories/mass-gainer.jpg", intro: "Quality sleep supports muscle repair, healthy hormones, focus, and the consistency needed for long-term progress." },
];
const toc = ["What is a Balanced Diet?", "Macronutrients: The Energy Providers", "Micronutrients: The Body Regulators", "How to Build a Balanced Meal", "Tips for a Healthier Diet", "Common Mistakes to Avoid", "Final Thoughts"];
const related = [
  ["Top 10 High Protein Foods You Should Eat Daily", "May 15, 2024", "4 min read"],
  ["5 Simple Habits for a Healthier Lifestyle", "May 12, 2024", "5 min read"],
  ["The Importance of Sleep for Muscle Growth", "May 2, 2024", "4 min read"],
] as const;
const product = PRODUCTS.find((item) => item.id === 3)!;
const micronutrients: { icon: IconType; title: string; detail: string }[] = [
  { icon: FiHeart, title: "Vitamins", detail: "Found in fruits and vegetables, they boost immunity and support growth." },
  { icon: FiShield, title: "Minerals", detail: "Calcium, iron, and zinc are essential for strong bones and healthy blood." },
  { icon: FiStar, title: "Antioxidants", detail: "Help fight free radicals and reduce inflammation in the body." },
  { icon: FiGlobe, title: "Water", detail: "Stay hydrated to support digestion, energy, and circulation." },
];
const trustStrip: { icon: IconType; title: string; detail: string }[] = [
  { icon: FiBookOpen, title: "Expert Backed Content", detail: "Articles written by nutrition experts" },
  { icon: FiUser, title: "Science Based", detail: "Research driven, results focused" },
  { icon: FiCalendar, title: "Regularly Updated", detail: "Fresh content every week" },
  { icon: FiHeart, title: "Your Health, Our Priority", detail: "Helping you live a better life" },
];

export function generateStaticParams() {
  return articleCatalog.map(({ slug }) => ({ slug }));
}

function SectionTitle({ number, children }: { number?: string; children: React.ReactNode }) {
  return <h2 className="mt-6 text-sm font-extrabold text-navy">{number && <span className="mr-1">{number}.</span>}{children}</h2>;
}

export default async function BlogArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article = articleCatalog.find((item) => item.slug === slug);
  if (!article) notFound();

  return <main className="container-page py-6 sm:py-8"><RelatedArticleRouter />
    <nav className="mb-5 flex flex-wrap items-center gap-2 text-[9px] text-slate-soft" aria-label="Breadcrumb"><Link href="/" className="hover:text-green-600">Home</Link><span>›</span><Link href="/blog" className="hover:text-green-600">Blog</Link><span>›</span><span>{article.category}</span><span>›</span><span className="text-navy">{article.title}</span></nav>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_235px]">
      <article className="min-w-0">
        <header className="grid gap-5 border-b border-line pb-5 md:grid-cols-[minmax(0,1fr)_minmax(300px,.9fr)] md:items-center"><div><span className="rounded bg-green-soft px-2 py-1 text-[7px] font-bold uppercase text-green-600">{article.category}</span><h1 className="mt-3 max-w-lg text-[25px] font-extrabold leading-8 tracking-tight sm:text-[29px]">{article.title}</h1><p className="mt-3 max-w-lg text-[10px] leading-4 text-slate-soft">Learn the basics of a balanced diet, macronutrients, micronutrients and how to plan your meals right for a healthier, happier you.</p><div className="mt-4 flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-full bg-[#b87945] text-[9px] font-bold text-white">RS</span><span><b className="block text-[9px]">Rahul Sharma <span className="text-green-600">●</span></b><small className="text-[8px] text-slate-soft">Nutrition Expert</small></span></div><div className="mt-4 flex flex-wrap items-center gap-3 text-[8px] text-slate-soft"><span><FiCalendar className="mr-1 inline" />{article.date}</span><span>•</span><span><FiClock className="mr-1 inline" />{article.read}</span><span>•</span><span>Share:</span><button type="button" aria-label="Share on Facebook" className="flex size-5 items-center justify-center rounded-full bg-gray-100 text-[8px] font-bold">f</button><button type="button" aria-label="Share on Twitter" className="flex size-5 items-center justify-center rounded-full bg-gray-100 text-[8px] font-bold">𝕏</button><button type="button" aria-label="Copy article link" className="flex size-5 items-center justify-center rounded-full bg-gray-100"><FiLink size={10} /></button></div></div><div className="relative aspect-[4/3] overflow-hidden rounded-lg"><Image src={article.image} alt="Balanced meal with protein" fill className="object-cover" priority /></div></header>
        <div className="max-w-2xl text-[10px] leading-5 text-navy"><p className="mt-5">{article.intro}</p><SectionTitle>What is a Balanced Diet?</SectionTitle><p className="mt-2">A balanced diet includes the right proportions of carbohydrates, proteins, fats, vitamins, minerals, and water. The key is variety, moderation, and balance.</p><SectionTitle number="1">Macronutrients: The Energy Providers</SectionTitle><p className="mt-2">Macronutrients provide the energy your body needs to perform daily activities.</p><ul className="mt-3 grid gap-2"><li><b className="text-green-600">●</b> <b>Carbohydrates:</b> Whole grains, fruits, vegetables, and legumes.</li><li><b className="text-green-600">●</b> <b>Proteins:</b> Lean meats, eggs, dairy, beans, and nuts.</li><li><b className="text-green-600">●</b> <b>Fats:</b> Healthy fats from avocados, nuts, seeds, and olive oil.</li></ul><div className="mt-4 rounded-md border border-green-100 bg-[#f4fbf5] p-3 text-[9px] text-slate-soft"><span className="mr-2 text-2xl text-green-600">”</span>The right balance of macronutrients helps in maintaining energy levels, building muscle, and supporting overall body functions.</div><SectionTitle number="2">Micronutrients: The Body Regulators</SectionTitle><p className="mt-2">Micronutrients, including vitamins and minerals, support immune function, bone health, metabolism, and more.</p><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{[[FiHeart, "Vitamins", "Found in fruits and vegetables, they boost immunity and support growth."], [FiShield, "Minerals", "Calcium, iron, and zinc are essential for strong bones and healthy blood."], [FiStar, "Antioxidants", "Help fight free radicals and reduce inflammation in the body."], [FiGlobe, "Water", "Stay hydrated to support digestion, energy, and circulation."]].map(([Icon, title, detail]) => <div key={title as string} className="rounded-md border border-[#e7edf0] p-3"><Icon className="text-green-600" size={15} /><p className="mt-2 text-[8px] font-bold">{title}</p><p className="mt-1 text-[7px] leading-3 text-slate-soft">{detail}</p></div>)}</div><SectionTitle number="3">How to Build a Balanced Meal</SectionTitle><p className="mt-2">A balanced meal should include a source of lean protein, plenty of colorful vegetables, whole-food carbohydrates, healthy fats, and water.</p><SectionTitle number="4">Tips for a Healthier Diet</SectionTitle><ul className="mt-2 grid gap-2"><li><FiCheck className="mr-1 inline text-green-600" />Plan your meals ahead and keep healthy snacks nearby.</li><li><FiCheck className="mr-1 inline text-green-600" />Choose minimally processed foods most of the time.</li><li><FiCheck className="mr-1 inline text-green-600" />Listen to your hunger and fullness cues.</li></ul></div>
      </article>
      <aside className="grid content-start gap-4"><div className="rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Table of Contents</h2><div className="mt-3 grid gap-1">{toc.map((item, index) => <a key={item} href={`#section-${index}`} className={`rounded px-2 py-2 text-[9px] font-medium hover:bg-green-soft ${index === 0 ? "bg-green-soft font-bold text-green-600" : ""}`}>{index + 1}. <span className="ml-1">{item}</span></a>)}</div></div><div className="rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">{product.name}</h2><p className="text-[8px] text-slate-soft">100% Pure Whey Protein</p><p className="mt-2 text-[9px] text-amber-500">★★★★★ <span className="text-slate-soft">4.8 ({product.reviews})</span></p><div className="mt-3 flex items-center gap-3"><Image src={product.image} alt={product.name} width={75} height={90} className="h-24 w-20 object-contain" /><div className="grid gap-2 text-[8px]"><span><FiCheck className="mr-1 inline text-green-600" />24g Protein Per Serving</span><span><FiCheck className="mr-1 inline text-green-600" />5.5g BCAAs</span><span><FiCheck className="mr-1 inline text-green-600" />Low Carbs &amp; Sugar</span><span><FiCheck className="mr-1 inline text-green-600" />Lab Tested &amp; Certified</span></div></div><Link href={`/product/${product.slug}`} className="mt-3 block rounded bg-green-600 py-2 text-center text-[9px] font-bold text-white">Shop Now <FiArrowRight className="ml-1 inline" /></Link></div><div className="rounded-lg border border-line bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-xs font-extrabold">Related Articles</h2><Link href="/blog" className="text-[8px] font-bold text-green-600">View All <FiArrowRight className="inline" /></Link></div>{related.map(([title, date, read], index) => <Link key={title} href="/blog" className="mt-3 flex gap-2"><span className="h-10 w-14 shrink-0 overflow-hidden rounded"><Image src={article.image} alt="" width={56} height={40} className="h-full w-full object-cover" /></span><span><b className="block text-[8px] leading-3">{title}</b><small className="text-[7px] text-slate-soft"><FiCalendar className="mr-1 inline" />{date} • {read}</small></span></Link>)}</div></aside>
    </div>
    <div className="mt-6 grid grid-cols-2 gap-3 rounded-lg border border-green-100 bg-[#f5fbf6] p-3 sm:grid-cols-4">{trustStrip.map(({ icon: Icon, title, detail }) => <div key={title} className="flex items-center gap-2"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-green-soft text-green-600"><Icon size={14} /></span><span><b className="block text-[8px]">{title}</b><small className="text-[7px] text-slate-soft">{detail}</small></span></div>)}</div>
  </main>;
}