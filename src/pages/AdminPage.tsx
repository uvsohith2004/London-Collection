import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { getProducts, createProduct, deleteProduct } from "@/lib/products";

export default function AdminPage() {
  const queryClient = useQueryClient();

  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
  });

  // 🔐 Check session on load
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getProducts,
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setForm({ name: "", price: "", image: "", category: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  // 🔐 LOGIN SCREEN
  if (!user) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl mb-6 font-bold">Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="border px-4 py-2 mr-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border px-4 py-2 mr-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-gold px-4 py-2"
          onClick={async () => {
            const { error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) {
              alert(error.message);
            } else {
              const { data } = await supabase.auth.getUser();
              setUser(data.user);
            }
          }}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin</h1>
        <div>
          <button
            className="text-sm text-red-500 mr-4"
            onClick={async () => {
              await supabase.auth.signOut();
              setUser(null);
            }}
          >
            Logout
          </button>
          <Link to="/" className="text-sm text-muted-foreground">
            ← Back to Store
          </Link>
        </div>
      </div>

      {/* CREATE PRODUCT */}
      <div className="border p-6 rounded mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            placeholder="Name"
            className="border px-3 py-2"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          <input
            placeholder="Price"
            type="number"
            className="border px-3 py-2"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />
          <input
            placeholder="Image URL"
            className="border px-3 py-2"
            value={form.image}
            onChange={(e) =>
              setForm({ ...form, image: e.target.value })
            }
          />
          <input
            placeholder="Category"
            className="border px-3 py-2"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />
        </div>

        <button
          className="mt-4 bg-gold px-4 py-2"
          onClick={() =>
            createMutation.mutate({
              name: form.name,
              price: Number(form.price),
              image: form.image,
              category: form.category,
            })
          }
        >
          Add Product
        </button>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="border rounded overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-right px-4 py-3">Price</th>
                <th className="text-right px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <span>{p.name}</span>
                  </td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3 text-right">
                    {Number(p.price).toFixed(3)} KWD
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="text-red-500 text-xs"
                      onClick={() => deleteMutation.mutate(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
