
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { IconType } from "react-icons";
import { FiActivity, FiArrowRight, FiBookOpen, FiCalendar, FiCheck, FiChevronDown, FiClock, FiHeart, FiPackage, FiSearch, FiShield, FiTrendingUp, FiUser } from "react-icons/fi";

type Article = { id: number; title: string; category: string; date: string; read: string; image: string; excerpt: string };
const articleSlugs: Record<string, string> = {
  "How to Build a Balanced Diet for Better Health": "how-to-build-a-balanced-diet-for-better-health",
  "Whey Protein: Benefits, Uses and Side Effects": "whey-protein-benefits-uses-and-side-effects",
  "Top 10 High Protein Foods You Should Eat Daily": "top-10-high-protein-foods-you-should-eat-daily",
  "5 Simple Habits for a Healthier Lifestyle": "5-simple-habits-for-a-healthier-lifestyle",
  "Creatine Monohydrate: Benefits, Dosage & How It Works": "creatine-monohydrate-benefits-dosage-how-it-works",
  "Pre & Post Workout Nutrition: What to Eat and When": "pre-post-workout-nutrition-what-to-eat-and-when",
  "Muscle Recovery: 7 Tips to Recover Faster": "muscle-recovery-7-tips-to-recover-faster",
  "The Importance of Sleep for Muscle Growth": "importance-of-sleep-for-muscle-growth",
};
const articles: Article[] = [
  { id: 1, title: "How to Build a Balanced Diet for Better Health", category: "Nutrition", date: "May 20, 2024", read: "5 min read", image: "/categories/mass-gainer.jpg", excerpt: "Learn the basics of a balanced diet, macronutrients, micronutrients and how to plan your meals right." },
  { id: 2, title: "Whey Protein: Benefits, Uses and Side Effects", category: "Fitness", date: "May 18, 2024", read: "6 min read", image: "/categories/mass-gainer.jpg", excerpt: "Everything you need to know about adding whey protein to your daily routine." },
  { id: 3, title: "Top 10 High Protein Foods You Should Eat Daily", category: "Nutrition", date: "May 15, 2024", read: "4 min read", image: "/categories/mass-gainer.jpg", excerpt: "Simple, delicious ways to get more quality protein from everyday foods." },
  { id: 4, title: "5 Simple Habits for a Healthier Lifestyle", category: "Wellness", date: "May 12, 2024", read: "5 min read", image: "/categories/mass-gainer.jpg", excerpt: "Small daily choices that can make a meaningful difference to your energy and wellbeing." },
  { id: 5, title: "Creatine Monohydrate: Benefits, Dosage & How It Works", category: "Supplements", date: "May 10, 2024", read: "6 min read", image: "/categories/mass-gainer.jpg", excerpt: "A practical guide to one of the most researched performance supplements." },
  { id: 6, title: "Pre & Post Workout Nutrition: What to Eat and When", category: "Nutrition", date: "May 8, 2024", read: "5 min read", image: "/categories/mass-gainer.jpg", excerpt: "Fuel your training and recovery with the right foods at the right time." },
  { id: 7, title: "Muscle Recovery: 7 Tips to Recover Faster", category: "Fitness", date: "May 5, 2024", read: "4 min read", image: "/categories/mass-gainer.jpg", excerpt: "Better recovery helps you train consistently and make stronger progress." },
  { id: 8, title: "The Importance of Sleep for Muscle Growth", category: "Wellness", date: "May 2, 2024", read: "4 min read", image: "/categories/mass-gainer.jpg", excerpt: "Why quality sleep belongs at the center of every healthy training plan." },
];
const categories = ["All", "Nutrition", "Fitness", "Wellness", "Supplements"];
const categoryIcons: Record<string, IconType> = { Nutrition: FiActivity, Fitness: FiTrendingUp, Wellness: FiHeart, Supplements: FiPackage };
const trustStrip: { icon: IconType; title: string; detail: string }[] = [
  { icon: FiBookOpen, title: "Expert Backed Content", detail: "Articles written by nutrition experts" },
  { icon: FiUser, title: "Science Based", detail: "Research driven, results focused" },
  { icon: FiCalendar, title: "Regularly Updated", detail: "Fresh content every week" },
  { icon: FiHeart, title: "Your Health, Our Priority", detail: "Helping you live a better life" },
];

function Meta({ article }: { article: Article }) {
  return <div className="mt-2 flex items-center gap-3 text-[8px] text-slate-soft"><span><FiCalendar className="mr-1 inline" />{article.date}</span><span><FiClock className="mr-1 inline" />{article.read}</span></div>;
}

function ArticleImage({ article, dark = false }: { article: Article; dark?: boolean }) {
  return <div className={`relative overflow-hidden ${dark ? "h-full min-h-60" : "h-24"}`}><img src={article.image} alt="" className={`h-full w-full object-cover ${dark ? "brightness-50" : "brightness-90"}`} /><div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" /></div>;
}

export default function BlogPage() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(4);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  useEffect(() => {
    const detailRoute = "/blog/how-to-build-a-balanced-diet-for-better-health";
    const articleLinks = document.querySelectorAll<HTMLAnchorElement>('a[href="#article-1"], a[href="#articles"], a[href="#top"]');
    const navigateToDetail = (event: Event) => {
      const link = event.currentTarget as HTMLAnchorElement;
      const title = Object.keys(articleSlugs).find((item) => link.textContent?.includes(item));
      if (!title) return;
      event.preventDefault();
      window.location.assign(title ? `/blog/${articleSlugs[title]}` : detailRoute);
    };
    articleLinks.forEach((link) => link.addEventListener("click", navigateToDetail));
    return () => articleLinks.forEach((link) => link.removeEventListener("click", navigateToDetail));
  }, []);
  const filtered = useMemo(() => articles.filter((article) => (category === "All" || article.category === category) && article.title.toLowerCase().includes(query.toLowerCase())), [category, query]);
  const featured = articles[0];
  const sideArticles = articles.slice(1, 4);

  return <section className="container-page bg-[#fbfcfe] py-7 text-navy">
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_235px]">
      <main className="min-w-0">
        <div className="relative min-h-40 overflow-hidden rounded-lg border border-line bg-white px-5 py-7 shadow-sm sm:px-8"><div className="relative z-10 max-w-sm"><h1 className="text-[28px] font-extrabold tracking-tight sm:text-[32px]">NutriGain <span className="text-green-600">Blog</span></h1><p className="mt-2 text-xs leading-5 text-slate-soft">Stay informed with expert-backed articles on nutrition, fitness, wellness and healthy living.</p><button type="button" onClick={() => document.getElementById("articles")?.scrollIntoView({ behavior: "smooth" })} className="mt-4 rounded bg-green-600 px-4 py-2 text-[10px] font-bold text-white">Explore Articles</button></div><div className="absolute right-0 top-0 hidden h-full w-1/2 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-70 sm:block" /></div>
        <div className="mt-5"><div className="mb-3 flex items-center justify-between px-1"><h2 className="text-sm font-extrabold">Featured Articles</h2><Link href="#articles" className="text-[9px] font-bold text-green-600">View All Articles <FiArrowRight className="inline" /></Link></div><div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,.9fr)]"><Link href="#article-1" className="relative overflow-hidden rounded-lg border border-line bg-navy-900 text-white shadow-sm"><ArticleImage article={featured} dark /><div className="absolute inset-x-4 bottom-4"><span className="rounded bg-green-600 px-2 py-1 text-[8px] font-bold uppercase">{featured.category}</span><h3 className="mt-3 max-w-xs text-lg font-extrabold leading-6">{featured.title}</h3><p className="mt-2 max-w-sm text-[9px] leading-4 text-gray-200">{featured.excerpt}</p><Meta article={featured} /></div></Link><div className="grid gap-2">{sideArticles.map((article) => <Link id={`article-${article.id}`} key={article.id} href="#articles" className="grid grid-cols-[105px_minmax(0,1fr)] gap-3 rounded-md border border-line bg-white p-2 shadow-sm"><ArticleImage article={article} /><div><span className="rounded bg-green-soft px-2 py-1 text-[7px] font-bold uppercase text-green-600">{article.category}</span><h3 className="mt-2 text-[10px] font-extrabold leading-3">{article.title}</h3><Meta article={article} /></div></Link>)}</div></div></div>
        <div id="articles" className="mt-6"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-sm font-extrabold">All Articles</h2><div className="flex flex-wrap gap-2">{categories.map((item) => <button type="button" key={item} onClick={() => { setCategory(item); setVisible(4); }} className={`rounded border px-3 py-1.5 text-[9px] ${category === item ? "border-green-200 bg-green-soft font-bold text-green-600" : "border-[#dce3eb] text-slate-soft"}`}>{item}</button>)}</div></div><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{filtered.slice(0, visible).map((article) => <Link id={`article-${article.id}`} href="#top" key={article.id} className="overflow-hidden rounded-md border border-line bg-white shadow-sm hover:border-green-300"><ArticleImage article={article} /><div className="p-3"><span className="rounded bg-green-soft px-2 py-1 text-[7px] font-bold uppercase text-green-600">{article.category}</span><h3 className="mt-2 text-[10px] font-extrabold leading-3">{article.title}</h3><Meta article={article} /></div></Link>)}</div>{filtered.length === 0 && <p className="py-8 text-center text-xs text-slate-soft">No articles found. Try another search or category.</p>}{visible < filtered.length && <button type="button" onClick={() => setVisible((value) => value + 4)} className="mx-auto mt-4 flex items-center gap-2 rounded border border-[#bdc8d6] px-5 py-2 text-[9px] font-bold">Load More Articles <FiChevronDown /></button>}</div>
      </main>

      <aside className="grid content-start gap-4"><div className="rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Search Articles</h2><label className="mt-3 flex items-center rounded border border-[#dce3eb] px-2"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for articles..." className="min-w-0 flex-1 py-2 text-[9px] outline-none" aria-label="Search articles" /><FiSearch className="text-slate-soft" size={14} /></label></div><div className="rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Categories</h2>{categories.slice(1).map((item) => { const Icon = categoryIcons[item]; const count = articles.filter((article) => article.category === item).length; return <button type="button" key={item} onClick={() => { setCategory(item); setVisible(4); }} className="mt-3 flex w-full items-center gap-2 text-left text-[9px] font-medium"><span className="flex size-5 items-center justify-center rounded bg-green-soft text-green-600"><Icon size={12} /></span>{item}<span className="ml-auto text-slate-soft">{count * 6}</span></button>; })}<button type="button" onClick={() => setCategory("All")} className="mt-4 text-[9px] font-bold text-green-600">View All Categories <FiArrowRight className="inline" /></button></div><div className="rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Popular Posts</h2>{sideArticles.map((article, index) => <Link key={article.id} href={`#article-${article.id}`} className="mt-3 flex items-center gap-2"><span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-green-600 text-[8px] font-bold text-white">{index + 1}</span><img src={article.image} alt="" className="size-9 rounded object-cover" /><span className="text-[8px] font-bold leading-3">{article.title}</span></Link>)}</div><div className="rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Stay Updated</h2><p className="mt-2 text-[9px] leading-4 text-slate-soft">Subscribe to get the latest health tips, exclusive offers and updates.</p><form onSubmit={(event) => { event.preventDefault(); if (email) setSubscribed(true); }} className="mt-3 flex rounded border border-[#dce3eb] p-0.5"><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" className="min-w-0 flex-1 px-2 text-[8px] outline-none" /><button className="rounded bg-green-600 px-2 py-1.5 text-[8px] font-bold text-white">Subscribe</button></form>{subscribed ? <p role="status" className="mt-2 text-[8px] font-bold text-green-600">You&apos;re subscribed. Welcome aboard!</p> : <p className="mt-2 text-[8px] text-slate-soft"><FiShield className="mr-1 inline text-green-600" />No spam, unsubscribe anytime</p>}</div></aside>
    </div>
    <div className="mt-5 grid grid-cols-2 gap-3 rounded-lg border border-green-100 bg-[#f5fbf6] p-3 sm:grid-cols-4">{trustStrip.map(({ icon: Icon, title, detail }) => <div key={title} className="flex items-center gap-2"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-green-soft text-green-600"><Icon size={14} /></span><span><b className="block text-[8px]">{title}</b><small className="text-[7px] text-slate-soft">{detail}</small></span></div>)}</div>
  </section>;
}
