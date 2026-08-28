import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/app/data/products";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInformation from "@/components/product/ProductInformation";
import ProductPurchasePanel from "@/components/product/ProductPurchasePanel";
import RelatedProducts from "@/components/product/RelatedProducts";
import CustomerReviews from "@/components/product/CustomerReviews";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = PRODUCTS.find(
    (item) => item.slug === slug || String(item.id) === slug,
  );
  if (!product) notFound();

  const relatedProducts = PRODUCTS.filter(
    (item) => item.categorySlug === product.categorySlug && item.id !== product.id,
  ).slice(0, 4);

  return (
    <main className="container-page py-6 sm:py-10">
      <nav
        className="mb-6 flex flex-wrap items-center gap-2 text-[11px] text-slate-soft"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-green-600">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-green-600">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.categorySlug}`} className="hover:text-green-600">
          {product.categoryLabel}
        </Link>
        <span>/</span>
        <span className="text-navy">{product.name}</span>
      </nav>

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <ProductGallery product={product} />
        <ProductPurchasePanel product={product} />
      </section>

      <ProductInformation product={product} />
      <CustomerReviews product={product} />
      <RelatedProducts products={relatedProducts} />
    </main>
  );
}
