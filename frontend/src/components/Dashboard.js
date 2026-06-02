import React, { useState, useEffect } from "react";
import { getProducts, getCustomers, getOrders } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    lowStockProducts: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, custRes, orderRes] = await Promise.all([
          getProducts(),
          getCustomers(),
          getOrders(),
        ]);
        setStats({
          totalProducts: prodRes.data.length,
          totalCustomers: custRes.data.length,
          totalOrders: orderRes.data.length,
          lowStockProducts: prodRes.data.filter((p) => p.stock < 10),
        });
      } catch {}
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Total Products</h3>
          <div className="value">{stats.totalProducts}</div>
        </div>
        <div className="stat-card">
          <h3>Total Customers</h3>
          <div className="value">{stats.totalCustomers}</div>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <div className="value">{stats.totalOrders}</div>
        </div>
        <div className="stat-card warning">
          <h3>Low Stock Items</h3>
          <div className="value">{stats.lowStockProducts.length}</div>
        </div>
      </div>

      {stats.lowStockProducts.length > 0 && (
        <div className="section">
          <h2 style={{ marginBottom: "1rem" }}>Low Stock Products (below 10)</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.sku}</td>
                    <td>${p.price.toFixed(2)}</td>
                    <td>
                      <span className="badge badge-low-stock">{p.stock}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
