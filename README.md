# Inventory & Order Management System

A full-stack web application for managing products, customers, orders, and inventory tracking. Built with **FastAPI**, **React**, and **PostgreSQL**, fully containerized with **Docker**.

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | [https://frontend-nu-five-73.vercel.app](https://frontend-nu-five-73.vercel.app) |
| Backend API | [https://backend-alpha-ten-42.vercel.app](https://backend-alpha-ten-42.vercel.app) |
| API Docs (Swagger) | [https://backend-alpha-ten-42.vercel.app/docs](https://backend-alpha-ten-42.vercel.app/docs) |
| Docker Image | [arnavdev25/inventory-backend](https://hub.docker.com/r/arnavdev25/inventory-backend) |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Axios, CSS3 |
| Backend | Python, FastAPI, SQLAlchemy |
| Database | PostgreSQL (Neon) |
| Containerization | Docker, Docker Compose |
| Deployment | Vercel (Frontend + Backend), Neon (Database) |

---

## Features

### Product Management
- Create, view, update, and delete products
- Unique SKU validation
- Low stock alerts (below 10 units)

### Customer Management
- Create, view, and delete customers
- Unique email validation

### Order Management
- Create orders with multiple items
- Automatic total amount calculation
- Stock validation before order placement
- Automatic inventory reduction on order creation
- Stock restoration on order cancellation

### Dashboard
- Total products, customers, and orders count
- Low stock product alerts

---

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/products` | Create a new product |
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products/{id}` | Get product by ID |
| `PUT` | `/api/products/{id}` | Update product |
| `DELETE` | `/api/products/{id}` | Delete product |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/customers` | Create a new customer |
| `GET` | `/api/customers` | Get all customers |
| `GET` | `/api/customers/{id}` | Get customer by ID |
| `DELETE` | `/api/customers/{id}` | Delete customer |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/orders` | Create a new order |
| `GET` | `/api/orders` | Get all orders |
| `GET` | `/api/orders/{id}` | Get order by ID |
| `DELETE` | `/api/orders/{id}` | Cancel/Delete order |

---

## Business Rules

- Product SKU must be **unique**
- Customer email must be **unique**
- Product stock **cannot be negative**
- Orders **cannot be placed** if inventory is insufficient
- Creating an order **automatically reduces** available stock
- Cancelling an order **restores** the stock
- Total order amount is **calculated automatically** by the backend
- All APIs include **proper error handling** with appropriate HTTP status codes

---

## Project Structure

```
inventory-order-management/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── database.py          # Database connection & session
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic request/response schemas
│   │   └── routes/
│   │       ├── products.py      # Product CRUD endpoints
│   │       ├── customers.py     # Customer CRUD endpoints
│   │       └── orders.py        # Order CRUD endpoints
│   ├── api/
│   │   └── index.py             # Vercel serverless entry point
│   ├── Dockerfile
│   ├── requirements.txt
│   └── vercel.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js               # Main app with tab navigation
│   │   ├── App.css              # Global responsive styles
│   │   ├── api.js               # Axios API client
│   │   ├── index.js
│   │   └── components/
│   │       ├── Dashboard.js     # Stats & low stock alerts
│   │       ├── Products.js      # Product management UI
│   │       ├── Customers.js     # Customer management UI
│   │       └── Orders.js        # Order management UI
│   ├── Dockerfile
│   ├── nginx.conf
│   └── netlify.toml
├── docker-compose.yml
├── render.yaml
├── .env                          # Environment variables (git-ignored)
├── .dockerignore
└── .gitignore
```

---

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Run with Docker Compose

```bash
# Clone the repository
git clone https://github.com/arnavdev25/inventory-order-management.git
cd inventory-order-management

# Create .env file
cat > .env << EOF
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=inventory_db
DATABASE_URL=postgresql://postgres:postgres@db:5432/inventory_db
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:80
EOF

# Start all services
docker compose up --build -d
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

### Run with Docker Image from Docker Hub

```bash
docker pull arnavdev25/inventory-backend:latest
docker run -p 8000:8000 \
  -e DATABASE_URL=<your-postgresql-url> \
  -e ALLOWED_ORIGINS=* \
  arnavdev25/inventory-backend:latest
```

### Local Development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
DATABASE_URL=<your-postgresql-url> uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000/api npm start
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@db:5432/inventory_db` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:3000` |
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:8000/api` |
| `POSTGRES_USER` | PostgreSQL username (Docker) | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password (Docker) | `postgres` |
| `POSTGRES_DB` | PostgreSQL database name (Docker) | `inventory_db` |

---

## Screenshots

### Dashboard
> Displays total products, customers, orders, and low stock alerts

### Product Management
> Add, edit, delete products with SKU uniqueness validation

### Order Management
> Create orders with stock validation and automatic total calculation

---

## Author

**Arnav** - [GitHub](https://github.com/arnavdev25)
