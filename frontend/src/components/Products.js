import React, { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch {
      setMessage({ type: "error", text: "Failed to fetch products" });
    }
  };

  const resetForm = () => {
    setForm({ name: "", sku: "", description: "", price: "", stock: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
    };

    if (!data.name || !data.sku || isNaN(data.price) || isNaN(data.stock)) {
      setMessage({ type: "error", text: "Please fill all required fields correctly" });
      return;
    }

    try {
      if (editing) {
        const { sku, ...updateData } = data;
        await updateProduct(editing, updateData);
        setMessage({ type: "success", text: "Product updated successfully" });
      } else {
        await createProduct(data);
        setMessage({ type: "success", text: "Product created successfully" });
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      const detail = err.response?.data?.detail || "Operation failed";
      setMessage({ type: "error", text: detail });
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      sku: product.sku,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setEditing(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      setMessage({ type: "success", text: "Product deleted" });
      fetchProducts();
    } catch (err) {
      const detail = err.response?.data?.detail || "Delete failed";
      setMessage({ type: "error", text: detail });
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div>
      {message && (
        <div className={`message message-${message.type}`}>{message.text}</div>
      )}

      <div className="section">
        <div className="section-header">
          <h2>Products</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Product
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>
                    {p.stock}
                    {p.stock < 10 && (
                      <span className="badge badge-low-stock" style={{ marginLeft: 8 }}>
                        Low
                      </span>
                    )}
                  </td>
                  <td className="actions">
                    <button className="btn btn-sm btn-primary" onClick={() => handleEdit(p)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", color: "#999" }}>
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="form-overlay" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="form-modal">
            <h3>{editing ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>SKU *</label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  required
                  disabled={!!editing}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  {editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
