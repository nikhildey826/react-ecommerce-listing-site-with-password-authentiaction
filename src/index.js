import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ----- REDUX SETUP -----

// Auth slice (simple auth simulation)
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: null,
    error: null,
  },
  reducers: {
    login: (state, action) => {
      // simulate user validation
      const { username, password } = action.payload;
      if (username === "admin" && password === "password") {
        state.isLoggedIn = true;
        state.user = { username };
        state.error = null;
      } else {
        state.error = "Invalid credentials";
      }
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

const { login, logout, clearError } = authSlice.actions;

// Product slice for CRUD
const productsSlice = createSlice({
  name: "products",
  initialState: [
    { id: 1, name: "Product A", price: 99.99 },
    { id: 2, name: "Product B", price: 149.99 },
  ],
  reducers: {
    addProduct: (state, action) => {
      state.push(action.payload);
    },
    updateProduct: (state, action) => {
      const { id, name, price } = action.payload;
      const index = state.findIndex((p) => p.id === id);
      if (index !== -1) {
        state[index] = { id, name, price };
      }
    },
    deleteProduct: (state, action) => {
      return state.filter((p) => p.id !== action.payload);
    },
  },
});

const { addProduct, updateProduct, deleteProduct } = productsSlice.actions;

// Store config
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    products: productsSlice.reducer,
  },
});

// --------- STYLES ---------

const styles = {
  container: {
    fontFamily:
      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: 900,
    margin: "20px auto",
    padding: 20,
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
    color: "#222",
  },
  errorMsg: {
    color: "red",
    marginBottom: 15,
  },
  buttonPrimary: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: 5,
    cursor: "pointer",
    fontWeight: "bold",
  },
  input: {
    padding: 10,
    margin: "10px 0",
    width: "100%",
    borderRadius: 5,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  label: {
    fontWeight: "600",
    marginTop: 10,
    display: "block",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  navButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 16,
    padding: 10,
    color: "#007bff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thtd: {
    border: "1px solid #ddd",
    padding: "10px 15px",
    textAlign: "left",
  },
  formRow: {
    marginBottom: 10,
  },
  flexRow: {
    display: "flex",
    gap: 10,
  },
  smallButton: {
    padding: "6px 12px",
    cursor: "pointer",
    borderRadius: 5,
    border: "none",
  },
  editBtn: {
    backgroundColor: "#ffc107",
    color: "#222",
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
    color: "#fff",
  },
};

// --------- COMPONENTS ---------

// Login Page
function LoginPage() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  useEffect(() => {
    if (auth.error) {
      const timer = setTimeout(() => dispatch(clearError()), 3000);
      return () => clearTimeout(timer);
    }
  }, [auth.error, dispatch]);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>CRM System - Login</h1>
      {auth.error && <div style={styles.errorMsg}>{auth.error}</div>}
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>Username</label>
        <input
          type="text"
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username (try 'admin')"
          required
          autoFocus
        />
        <label style={styles.label}>Password</label>
        <input
          type="password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password (try 'password')"
          required
        />
        <button type="submit" style={styles.buttonPrimary}>
          Login
        </button>
      </form>
    </div>
  );
}

// Dashboard Page with Chart
function Dashboard() {
  // Sample sales data
  const salesData = [
    { month: "Jan", sales: 400 },
    { month: "Feb", sales: 350 },
    { month: "Mar", sales: 500 },
    { month: "Apr", sales: 450 },
    { month: "May", sales: 600 },
    { month: "Jun", sales: 700 },
    { month: "Jul", sales: 650 },
    { month: "Aug", sales: 800 },
    { month: "Sep", sales: 750 },
    { month: "Oct", sales: 900 },
    { month: "Nov", sales: 850 },
    { month: "Dec", sales: 1000 },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Dashboard - Sales Overview</h1>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesData} margin={{ top: 5, right: 30, bottom: 5, left: 20 }}>
          <Line type="monotone" dataKey="sales" stroke="#007bff" strokeWidth={3} />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Product Management Page (CRUD)
function ProductManagement() {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  // Form state for add/edit
  const [form, setForm] = useState({ id: null, name: "", price: "" });
  const [isEditing, setIsEditing] = useState(false);

  const resetForm = () => {
    setForm({ id: null, name: "", price: "" });
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price.trim()) return;

    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum < 0) return alert("Please enter a valid price.");

    if (isEditing) {
      dispatch(updateProduct({ id: form.id, name: form.name, price: priceNum }));
    } else {
      const newId = products.length ? products[products.length - 1].id + 1 : 1;
      dispatch(addProduct({ id: newId, name: form.name, price: priceNum }));
    }
    resetForm();
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
    });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Product Management</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <div style={styles.formRow}>
          <label style={styles.label}>Product Name</label>
          <input
            type="text"
            style={styles.input}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter product name"
            required
          />
        </div>
        <div style={styles.formRow}>
          <label style={styles.label}>Price ($)</label>
          <input
            type="number"
            style={styles.input}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Enter price"
            step="0.01"
            min="0"
            required
          />
        </div>
        <button type="submit" style={styles.buttonPrimary}>
          {isEditing ? "Update Product" : "Add Product"}
        </button>{" "}
        {isEditing && (
          <button
            type="button"
            onClick={resetForm}
            style={{ ...styles.buttonPrimary, backgroundColor: "#6c757d", marginLeft: 10 }}
          >
            Cancel
          </button>
        )}
      </form>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.thtd}>ID</th>
            <th style={styles.thtd}>Name</th>
            <th style={styles.thtd}>Price ($)</th>
            <th style={styles.thtd}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: 20 }}>
                No products found.
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td style={styles.thtd}>{p.id}</td>
                <td style={styles.thtd}>{p.name}</td>
                <td style={styles.thtd}>{p.price.toFixed(2)}</td>
                <td style={styles.thtd}>
                  <button
                    style={{ ...styles.smallButton, ...styles.editBtn }}
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    style={{ ...styles.smallButton, ...styles.deleteBtn }}
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Main App Component with routing logic
function App() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Page state: 'dashboard' or 'products'
  const [page, setPage] = useState("dashboard");

  if (!auth.isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <div>
      <nav style={styles.nav}>
        <div>
          <button
            style={styles.navButton}
            onClick={() => setPage("dashboard")}
            disabled={page === "dashboard"}
          >
            Dashboard
          </button>
          <button
            style={styles.navButton}
            onClick={() => setPage("products")}
            disabled={page === "products"}
          >
            Products
          </button>
        </div>
        <button
          style={{ ...styles.navButton, color: "#dc3545" }}
          onClick={() => dispatch(logout())}
          title="Logout"
        >
          Logout ({auth.user.username})
        </button>
      </nav>

      {page === "dashboard" && <Dashboard />}
      {page === "products" && <ProductManagement />}
    </div>
  );
}

// Render
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
