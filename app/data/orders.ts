import { PRODUCTS } from "@/app/data/products";

export type OrderStatus = "Delivered" | "Shipped" | "Cancelled";
export type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  statusDate: string;
  paymentMethod: string;
  total: number;
  productIds: number[];
};

export const ORDERS: Order[] = [
  { id: "NG-2024-05-18-12345", date: "18 May 2024, 10:30 AM", status: "Delivered", statusDate: "22 May 2024", paymentMethod: "UPI", total: 6399, productIds: [1, 3, 4, 6] },
  { id: "NG-2024-05-05-11223", date: "05 May 2024, 02:15 PM", status: "Delivered", statusDate: "09 May 2024", paymentMethod: "UPI", total: 2799, productIds: [2, 6] },
  { id: "NG-2024-04-24-09876", date: "24 Apr 2024, 11:20 AM", status: "Shipped", statusDate: "Expected 27 May 2024", paymentMethod: "Card", total: 3598, productIds: [7, 2, 6] },
  { id: "NG-2024-04-10-07765", date: "10 Apr 2024, 09:45 AM", status: "Cancelled", statusDate: "11 Apr 2024", paymentMethod: "UPI", total: 1299, productIds: [4] },
];

export const ORDER_STATUS_COUNTS = [
  ["All Orders", 12],
  ["Delivered", 8],
  ["Shipped", 2],
  ["Processing", 1],
  ["Cancelled", 1],
  ["Returned", 0],
] as const;

export function getOrderProducts(order: Order) {
  return order.productIds.map((id) => PRODUCTS.find((product) => product.id === id)).filter((product): product is (typeof PRODUCTS)[number] => Boolean(product));
}
