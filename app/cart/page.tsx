"use client";

import Link from "next/link";
import { FiArrowLeft, FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from "react-icons/fi";
import { PRODUCTS } from "@/app/data/products";
import { useCart } from "@/app/hooks/useCart";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import ProductCard from "@/components/shop/ProductCard";

export default function CartPage() {
  const { items, loading, updateQuantity, removeItem, clearCart } = useCart();
  const cartProducts = items.map((item) => ({ product: PRODUCTS.find((product) => product.id === item.productId), quantity: item.quantity })).filter((item): item is { product: (typeof PRODUCTS)[number]; quantity: number } => Boolean(item.product));
  const subtotal = cartProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const savings = cartProducts.reduce((sum, item) => sum + (item.product.mrp ? item.product.mrp - item.product.price : 0) * item.quantity, 0);
  const related = PRODUCTS.filter((product) => !items.some((item) => item.productId === product.id)).slice(0, 5);

  if (loading) return <main className="container-page py-12 text-sm text-slate-soft">Loading cart...</main>;

  return <main className="container-page py-8 sm:py-12"><nav className="mb-4 flex items-center gap-2 text-xs text-slate-soft"><Link href="/">Home</Link><span>/</span><span className="text-navy">Cart</span></nav><div className="mb-7 flex items-end justify-between gap-4"><div><h1 className="text-2xl font-extrabold text-navy sm:text-3xl">Your Cart</h1><p className="mt-1 text-xs text-slate-soft">Review your items and proceed to secure checkout.</p></div>{cartProducts.length > 0 && <p className="hidden text-xs text-green-600 sm:block">Free shipping on orders above ₹1,999</p>}</div>{cartProducts.length === 0 ? <EmptyCart /> : <><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]"><div className="overflow-hidden rounded-xl border border-line bg-white"><div className="hidden grid-cols-[minmax(260px,1.6fr)_120px_130px_100px] gap-4 border-b border-line bg-[#fbfcfd] px-6 py-3 text-[10px] font-bold uppercase text-slate-soft sm:grid"><span>Product</span><span>Price</span><span>Quantity</span><span>Total</span></div>{cartProducts.map(({ product, quantity }) => <CartItemRow key={product.id} product={product} quantity={quantity} onQuantityChange={(nextQuantity) => updateQuantity(product.id, nextQuantity)} onRemove={() => removeItem(product.id)} />)}<div className="flex flex-wrap justify-between gap-3 border-t border-line px-4 py-4 sm:px-6"><Link href="/shop" className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-xs font-semibold text-navy"><FiArrowLeft /> Continue Shopping</Link><button type="button" onClick={clearCart} className="text-xs font-semibold text-red-500">Clear Cart</button></div></div><CartSummary subtotal={subtotal} savings={savings} onClear={() => undefined} /></div><TrustStrip /><section className="mt-8"><div className="flex items-center justify-between"><h2 className="text-lg font-extrabold text-navy">You May Also Like</h2><Link href="/shop" className="text-xs font-semibold text-green-600">View All</Link></div><div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-5">{related.map((product) => <ProductCard key={product.id} product={product} />)}</div></section></>}</main>;
}

function EmptyCart() { return <div className="rounded-xl border border-line bg-white p-10 text-center"><h2 className="text-lg font-bold text-navy">Your cart is empty</h2><p className="mt-2 text-sm text-slate-soft">Add products to continue shopping.</p><Link href="/shop" className="mt-5 inline-flex items-center gap-2 rounded-md bg-green-600 px-5 py-3 text-xs font-bold text-white">Explore Products <FiArrowRight /></Link></div>; }
function TrustStrip() { return <div className="mt-8 grid gap-5 rounded-xl border border-line bg-linear-to-r from-[#f4faf8] to-white p-5 sm:grid-cols-4"><Info icon={<FiTruck />} title="Free Delivery" detail="On orders above ₹1,999" /><Info icon={<FiShield />} title="Lab Tested" detail="For purity & safety" /><Info icon={<FiRefreshCw />} title="Easy Returns" detail="Hassle-free returns" /><Info icon={<FiHeadphones />} title="Customer Support" detail="24/7 assistance" /></div>; }
function Info({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) { return <div className="flex items-center gap-3 text-xs"><span className="text-green-600">{icon}</span><div><p className="font-bold text-navy">{title}</p><p className="mt-1 text-[10px] text-slate-soft">{detail}</p></div></div>; }
