import React, { useState, useEffect } from "react";
import { getOrders, getOrder, createOrder, deleteOrder, getCustomers, getProducts } from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    customer_id: "",
    items: [{ product_id: "", quantity: "" }],
  });

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch {
      setMessage({ type: "error", text: "Failed to fetch orders" });
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch {}
  };

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch {}
  };

  const resetForm = () => {
    setForm({ customer_id: "", items: [{ product_id: "", quantity: "" }] });
    setShowForm(false);
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { product_id: "", quantity: "" }] });
  };

  const removeItem = (index) => {
    if (form.items.length <= 1) return;
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  };

  const updateItem = (index, field, value) => {
    const items = [...form.items];
    items[index] = { ...items[index], [field]: value };
    setForm({ ...form, items });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_id) {
      setMessage({ type: "error", text: "Please select a customer" });
      return;
    }

    const items = form.items
      .filter((item) => item.product_id && item.quantity)
      .map((item) => ({
        product_id: parseInt(item.product_id, 10),
        quantity: parseInt(item.quantity, 10),
      }));

    if (items.length === 0) {
      setMessage({ type: "error", text: "Please add at least one item" });
      return;
    }

    try {
      await createOrder({
        customer_id: parseInt(form.customer_id, 10),
        items,
      });
      setMessage({ type: "success", text: "Order created successfully" });
      resetForm();
      fetchOrders();
      fetchProducts();
    } catch (err) {
      const detail = err.response?.data?.detail || "Order creation failed";
      setMessage({ type: "error", text: detail });
    }
  };

  const handleViewOrder = async (id) => {
    try {
      const res = await getOrder(id);
      setSelectedOrder(res.data);
    } catch {
      setMessage({ type: "error", text: "Failed to load order details" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await deleteOrder(id);
      setMessage({ type: "success", text: "Order cancelled and stock restored" });
      setSelectedOrder(null);
      fetchOrders();
      fetchProducts();
    } catch (err) {
      const detail = err.response?.data?.detail || "Delete failed";
      setMessage({ type: "error", text: detail });
    }
  };

  const getCustomerName = (id) => customers.find((c) => c.id === id)?.name || `#${id}`;
  const getProductName = (id) => products.find((p) => p.id === id)?.name || `#${id}`;

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
          <h2>Orders</h2>
          <button className="btn btn-primary" onClick={() => { setShowForm(true); fetchCustomers(); fetchProducts(); }}>
            + Create Order
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{getCustomerName(o.customer_id)}</td>
                  <td>${o.total_amount.toFixed(2)}</td>
                  <td>
                    <span className={`badge badge-${o.status}`}>{o.status}</span>
                  </td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="actions">
                    <button className="btn btn-sm btn-primary" onClick={() => handleViewOrder(o.id)}>
                      View
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(o.id)}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", color: "#999" }}>
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="form-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}>
          <div className="form-modal">
            <h3>Order #{selectedOrder.id} Details</h3>
            <div className="order-detail">
              <p><strong>Customer:</strong> {getCustomerName(selectedOrder.customer_id)}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
              <h4 style={{ marginTop: "1rem" }}>Items</h4>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td>{getProductName(item.product_id)}</td>
                      <td>{item.quantity}</td>
                      <td>${item.unit_price.toFixed(2)}</td>
                      <td>${(item.quantity * item.unit_price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ marginTop: "1rem", fontSize: "1.1rem", fontWeight: 700 }}>
                Total: ${selectedOrder.total_amount.toFixed(2)}
              </p>
            </div>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="form-overlay" onClick={(e) => e.target === e.currentTarget && resetForm()}>
          <div className="form-modal">
            <h3>Create Order</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Customer *</label>
                <select
                  value={form.customer_id}
                  onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                  required
                >
                  <option value="">Select a customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <label style={{ fontWeight: 500, color: "#555", fontSize: "0.85rem" }}>
                Order Items *
              </label>
              {form.items.map((item, index) => (
                <div key={index} className="order-item-row">
                  <div className="form-group">
                    <select
                      value={item.product_id}
                      onChange={(e) => updateItem(index, "product_id", e.target.value)}
                      required
                    >
                      <option value="">Product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Stock: {p.stock})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ maxWidth: 100 }}>
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                      required
                    />
                  </div>
                  {form.items.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => removeItem(index)}
                      style={{ marginBottom: "0.5rem" }}
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-sm btn-secondary" onClick={addItem}>
                + Add Item
              </button>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
