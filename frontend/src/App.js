import React, { useState } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Customers from "./components/Customers";
import Orders from "./components/Orders";

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "products", label: "Products" },
  { key: "customers", label: "Customers" },
  { key: "orders", label: "Orders" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <Products />;
      case "customers":
        return <Customers />;
      case "orders":
        return <Orders />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1>Inventory & Order Management</h1>
        <div className="nav-links">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? "active" : ""}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
      <main className="main-content">{renderContent()}</main>
    </div>
  );
}
