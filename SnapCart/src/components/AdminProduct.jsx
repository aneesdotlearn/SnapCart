import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "./Footer";
// import Navbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";

const emptyForm = {
  id: "",
  name: "",
  price: "",
  quantity: "",
  image: "",
  category: "",
};

const AdminProduct = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    try {
      const resp = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`);
      setProducts(resp.data.data || resp.data.products || []);
    } catch (err) {
      console.log(err);
      setMessage("Unable to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditId(null);
  };

  const getPayload = () => ({
    id: formData.id,
    name: formData.name,
    price: Number(formData.price),
    quantity: Number(formData.quantity),
    image: formData.image,
    category: formData.category,
  });

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      if (editId) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/products/${editId}`, getPayload(), {
          headers: getAuthHeaders(),
        });
        setMessage("Product updated successfully");
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/create`, getPayload(), {
          headers: getAuthHeaders(),
        });
        setMessage("Product created successfully");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEditClick = (product) => {
    setEditId(product.id);
    setFormData({
      id: product.id || "",
      name: product.name || "",
      price: product.price || "",
      quantity: product.quantity || "",
      image: product.image || "",
      category: product.category || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/products/${id}`, {
        headers: getAuthHeaders(),
      });
      setMessage("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar/>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase text-orange-500">Admin</p>
          <h1 className="text-3xl font-black text-purple-950">
            Product Management
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-lg border bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 text-xl font-bold text-purple-950">
            {editId ? "Edit Product" : "Add New Product"}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="font-semibold text-purple-900">Product ID</span>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                disabled={!!editId}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100"
                placeholder="1"
              />
            </label>

            <label className="block">
              <span className="font-semibold text-purple-900">Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Fresh Apple - 1kg"
              />
            </label>

            <label className="block">
              <span className="font-semibold text-purple-900">Price</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="120"
              />
            </label>

            <label className="block">
              <span className="font-semibold text-purple-900">Quantity</span>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="20"
              />
            </label>

            <label className="block">
              <span className="font-semibold text-purple-900">Category</span>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Fruits"
              />
            </label>

            <label className="block">
              <span className="font-semibold text-purple-900">Image URL</span>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="https://example.com/product.jpg"
              />
            </label>
          </div>

          {message && (
            <p className="mt-4 rounded-lg bg-orange-50 px-4 py-3 font-semibold text-orange-700">
              {message}
            </p>
          )}

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-900"
            >
              {editId ? "Update Product" : "Add Product"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg bg-gray-200 px-5 py-3 font-bold text-purple-900 transition hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <section>
          <h2 className="mb-4 text-xl font-bold text-purple-950">
            All Products ({products.length})
          </h2>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="flex flex-col justify-between rounded-lg border bg-white p-4 shadow-sm"
              >
                <div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="mb-3 h-36 w-full object-contain"
                  />
                  <h3 className="line-clamp-2 font-bold text-purple-950">
                    {product.name}
                  </h3>
                  <p className="mt-2 font-bold text-orange-600">
                    Rs {product.price}
                  </p>
                  <p className="text-sm text-gray-500">
                    Stock: {product.quantity || 0}
                  </p>
                  <p className="text-sm text-gray-500">
                    Category: {product.category || "Uncategorized"}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditClick(product)}
                    className="flex-1 rounded-lg border border-purple-900 py-2 font-bold text-purple-900 transition hover:bg-purple-900 hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(product.id)}
                    className="flex-1 rounded-lg border border-red-600 py-2 font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AdminProduct;
