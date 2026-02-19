export default function ProductCard({ product }: any) {
  return (
    <div className="border rounded p-4">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded"
      />

      <h2 className="mt-4 font-semibold">
        {product.name}
      </h2>

      <p className="text-sm text-muted-foreground">
        {product.category}
      </p>

      <p className="mt-2 font-bold">
        {Number(product.price).toFixed(3)} KWD
      </p>
    </div>
  );
}
