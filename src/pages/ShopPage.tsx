import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function ShopPage() {
  const { category } = useParams<{ category?: string }>();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["shop-products"],
    queryFn: getProducts,
  });

  const filtered = category
    ? products.filter((p: any) => p.category === category)
    : products;

  return (
    <div className="container py-10">
      {/* Breadcrumb */}
      <div className="text-xs text-muted-foreground mb-6 uppercase">
        <Link to="/" className="hover:text-gold">Home</Link>
        <span className="mx-2">/</span>
        <span>Shop</span>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl mb-8"
      >
        {category ? category : "All Products"}
      </motion.h1>

      {isLoading ? (
        <p className="text-center py-20">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-20">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
