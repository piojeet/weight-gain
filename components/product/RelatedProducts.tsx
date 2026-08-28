import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import type { Product } from "@/app/types/shop";

export default function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <section className="mt-12">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-navy">You May Also Like</h2>
        <Link href="/shop" className="text-xs font-semibold text-green-600">View All</Link>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
