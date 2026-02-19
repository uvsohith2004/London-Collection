import { supabase } from "@/lib/supabaseClient";

// GET PRODUCTS
export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("GET ERROR:", error);
    throw new Error(error.message);
  }

  return data;
};

// CREATE PRODUCT
export const createProduct = async (product: {
  name: string;
  price: number;
  image: string;
  category: string;
}) => {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select();

  console.log("INSERT RESULT:", data);
  console.log("INSERT ERROR:", error);

  if (error) throw new Error(error.message);

  return data;
};

// DELETE PRODUCT
export const deleteProduct = async (id: number | string) => {
  if (!id) {
    console.log("Invalid ID:", id);
    return;
  }

  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", String(id)) // force string match
    .select();

  console.log("DELETE RESULT:", data);
  console.log("DELETE ERROR:", error);

  if (error) throw new Error(error.message);

  return data;
};
