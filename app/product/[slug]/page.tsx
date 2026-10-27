import Link from "next/link";
import { notFound } from "next/navigation";
import { commerceApi, normalizeCommerceProduct } from "@/lib/api/commerce";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInformation from "@/components/product/ProductInformation";
import ProductPurchasePanel from "@/components/product/ProductPurchasePanel";
import RelatedProducts from "@/components/product/RelatedProducts";
import CustomerReviews from "@/components/product/CustomerReviews";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  let response;
  try { response = await fetch(`${process.env.API_SERVER_URL ?? "http://localhost:3001/v1"}/api/products/${encodeURIComponent(slug)}`, { cache: "no-store" }).then((res) => res.ok ? res.json() : null); } catch { response = null; }
  if (!response?.success || !response.data?.product) notFound();
  const product = normalizeCommerceProduct(response.data.product);

  const relatedProducts = (response.data.related ?? []).map(normalizeCommerceProduct).slice(0, 4);

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
