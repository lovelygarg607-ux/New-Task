import React, { useEffect, useMemo, useState } from "react";

function AdminDashboard() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productsSearch, setProductsSearch] = useState("");
  const [topProductsSearch, setTopProductsSearch] = useState("");
  const [productRows, setProductRows] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoriesSearch, setCategoriesSearch] = useState("");
  const [categoryRows, setCategoryRows] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [totalCategories, setTotalCategories] = useState(0);

  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    categories: "",
    price: "",
    themes: "",
    published: true,
    featured: false,
  });

  const [newCategory, setNewCategory] = useState({
    name: "",
    baseCategory: "",
    brands: "",
    priority: 0,
    theme: "",
  });
  const [productTrend, setProductTrend] = useState([32, 48, 28, 63, 41, 56, 38, 71, 45, 62, 35, 58]);
  const [earningTrend, setEarningTrend] = useState([24, 52, 33, 66, 42, 74]);
  const [salesTrend, setSalesTrend] = useState([28, 18, 22, 15, 72, 20]);
  const [trendKey, setTrendKey] = useState(0);



  const topCards = [
    { icon: "orders", label: "Total Orders", value: "227" },
    { icon: "pending", label: "Pending", value: "97" },
    { icon: "processing", label: "Order Processing", value: "0" },
    { icon: "delivered", label: "Total Delivered", value: "130" },
  ];

  const orders = [
    { order: "PO-30124", customer: "Anuj Sharma", product: "Men's Slipper", status: "Active", price: "$45", joined: "11 Feb 2026", type: "NEW", page: "Cart" },
    { order: "PO-30125", customer: "Neha Verma", product: "Smart Watch", status: "Completed", price: "$220", joined: "13 Feb 2026", type: "PAID", page: "Checkout" },
    { order: "PO-30126", customer: "Rohit Mehta", product: "Headphone", status: "Pending", price: "$78", joined: "16 Feb 2026", type: "NEW", page: "Offer" },
    { order: "PO-30127", customer: "Priya Singh", product: "School Bag", status: "Active", price: "$60", joined: "18 Feb 2026", type: "PAID", page: "Home" },
    { order: "PO-30128", customer: "Ravi Kumar", product: "Laptop Stand", status: "Completed", price: "$98", joined: "20 Feb 2026", type: "REFUND", page: "Profile" },
  ];

  const adminAvatar =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%2316a34a'/><stop offset='1' stop-color='%2360a5fa'/></linearGradient></defs><rect width='64' height='64' rx='32' fill='url(%23g)'/><circle cx='32' cy='25' r='12' fill='%23fff'/><path d='M12 56c4-10 13-15 20-15s16 5 20 15' fill='%23fff'/></svg>";
  const totalEarning = useMemo(
    () => productRows.reduce((sum, item) => sum + Number(item.price || 0), 0),
    [productRows]
  );
  const categorySalesData = useMemo(() => {
    const palette = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];
    const counts = productRows.reduce((acc, item) => {
      const categories = String(item.categories || "Uncategorized")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      categories.forEach((name) => {
        acc[name] = (acc[name] || 0) + 1;
      });
      return acc;
    }, {});

    let entries = Object.entries(counts);

    if (entries.length === 0 && categoryRows.length > 0) {
      entries = categoryRows.map((item) => [item.name || "Category", 1]);
    }

    if (entries.length === 0) {
      entries = [
        ["General", 3],
        ["Lifestyle", 2],
        ["Essentials", 1],
      ];
    }

    const topEntries = entries.sort((a, b) => b[1] - a[1]).slice(0, 3);
    const total = topEntries.reduce((sum, [, value]) => sum + value, 0) || 1;

    return topEntries.map(([name, value], index) => ({
      name,
      value,
      share: Number(((value / total) * 100).toFixed(1)),
      color: palette[index % palette.length],
    }));
  }, [productRows, categoryRows]);
  const topSellingProducts = useMemo(() => {
    const list = [...productRows].sort((a, b) => {
      if (Boolean(a.featured) !== Boolean(b.featured)) return Number(b.featured) - Number(a.featured);
      return Number(b.price || 0) - Number(a.price || 0);
    });

    if (list.length === 0) {
      return [
        { name: "Men's Slipper", brand: "Daily Wear", soldUnits: 59 },
        { name: "Smart Watch", brand: "Tech Brand", soldUnits: 34 },
        { name: "School Bag", brand: "Carry Pro", soldUnits: 31 },
        { name: "Sports Shoes", brand: "RunFit", soldUnits: 27 },
      ];
    }

    return list.slice(0, 20).map((item) => ({
      name: item.name || "Unnamed Product",
      brand: item.brand || "Unknown Brand",
      soldUnits: Math.max(
        8,
        Math.round(Number(item.price || 0) / 30) + (item.featured ? 12 : 0)
      ),
    }));
  }, [productRows]);

  const generateTrend = (base) => {
    const seed = Math.max(base, 1);
    return new Array(6).fill(0).map((_, index) => {
      const wave = Math.sin((seed + index) * 0.85) * 14;
      const jitter = Math.cos((seed + index * 2) * 0.55) * 8;
      const value = 40 + wave + jitter + index * 2;
      return Math.max(16, Math.min(88, Math.round(value)));
    });
  };
  const generateBarTrend = (base, points = 12) => {
    const seed = Math.max(base, 1);
    return new Array(points).fill(0).map((_, index) => {
      const wave = Math.sin((seed + index) * 0.7) * 24;
      const jitter = Math.cos((seed + index * 1.5) * 0.45) * 10;
      const value = 42 + wave + jitter;
      return Math.max(18, Math.min(95, Math.round(value)));
    });
  };

  const formatPrice = (value) => {
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) return value;
    return `$${numberValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await fetch("https://new-task-2-g3c8.onrender.com/store/admin/products?limit=15&page=1");
      const result = await response.json();
      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Failed to fetch products");
      }
      setProductRows(result.data || []);
      setTotalProducts(result.total || 0);
    } catch (error) {
      console.error(error.message);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch("https://new-task-2-g3c8.onrender.com/store/admin/categories?limit=15&page=1");
      const result = await response.json();
      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Failed to fetch categories");
      }
      setCategoryRows(result.data || []);
      setTotalCategories(result.total || 0);
    } catch (error) {
      console.error(error.message);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeView === "all-products") fetchProducts();
    if (activeView === "all-categories") fetchCategories();
  }, [activeView]);

  useEffect(() => {
    setProductTrend(generateBarTrend(totalProducts + 5, 12));
    setEarningTrend(generateTrend(Math.round(totalEarning / 500)));
    setSalesTrend(generateTrend(Math.round(totalEarning / 800)));
    setTrendKey((prev) => prev + 1);
  }, [totalProducts, totalEarning]);

  useEffect(() => {
    document.body.classList.toggle("body-dark", isDarkMode);
    return () => document.body.classList.remove("body-dark");
  }, [isDarkMode]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const shouldLockBody = isSidebarOpen && window.innerWidth <= 768;
    document.body.classList.toggle("sidebar-open", shouldLockBody);
    return () => document.body.classList.remove("sidebar-open");
  }, [isSidebarOpen]);

  useEffect(() => {
    if (activeView === "all-products" || activeView === "all-categories") {
      setIsProductsOpen(true);
    }
  }, [activeView]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.assign("/");
  };

  const handleSetActiveView = (view) => {
    setActiveView(view);
    if (view === "all-products") fetchProducts();
    if (view === "all-categories") fetchCategories();
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductsToggle = () => {
    const nextOpen = !isProductsOpen;
    setIsProductsOpen(nextOpen);
    if (nextOpen) {
      handleSetActiveView("all-products");
    }
  };

  const resetProductForm = () => {
    setNewProduct({
      name: "",
      brand: "",
      categories: "",
      price: "",
      themes: "",
      published: true,
      featured: false,
    });
    setEditingProductId(null);
  };

  const resetCategoryForm = () => {
    setNewCategory({
      name: "",
      baseCategory: "",
      brands: "",
      priority: 0,
      theme: "",
    });
    setEditingCategoryId(null);
  };

  const handleOpenAddProduct = () => {
    resetProductForm();
    setShowAddProductForm(true);
  };

  const handleCloseAddProduct = () => {
    setShowAddProductForm(false);
    resetProductForm();
  };

  const handleOpenAddCategory = () => {
    resetCategoryForm();
    setShowAddCategoryForm(true);
  };

  const handleCloseAddCategory = () => {
    setShowAddCategoryForm(false);
    resetCategoryForm();
  };

  const handleAddProductChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewProduct((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAddCategoryChange = (event) => {
    const { name, value } = event.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setNewProduct({
      name: product.name || "",
      brand: product.brand || "",
      categories: product.categories || "",
      price: product.price ?? "",
      themes: product.themes || "",
      published: Boolean(product.published),
      featured: Boolean(product.featured),
    });
    setShowAddProductForm(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category._id);
    setNewCategory({
      name: category.name || "",
      baseCategory: category.baseCategory || "",
      brands: category.brands || "",
      priority: category.priority ?? 0,
      theme: category.theme || "",
    });
    setShowAddCategoryForm(true);
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`https://new-task-2-g3c8.onrender.com/store/admin/products/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Failed to delete product");
      }
      await fetchProducts();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`https://new-task-2-g3c8.onrender.com/store/admin/categories/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Failed to delete category");
      }
      await fetchCategories();
    } catch (error) {
      console.error(error.message);
    }
  };

const BASE_URL = "https://new-task-2-g3c8.onrender.com";

const handleAddProductSubmit = async (event) => {
  event.preventDefault();

  if (!newProduct.name.trim() || 
      !newProduct.brand.trim() || 
      !String(newProduct.price).trim()) return;

  const payload = {
    name: newProduct.name.trim(),
    brand: newProduct.brand.trim(),
    categories: newProduct.categories.trim() || "-",
    price: Number(String(newProduct.price).replace(/,/g, "")),
    themes: newProduct.themes.trim() || "General",
    published: newProduct.published,
    featured: newProduct.featured,
  };

  try {
    const isUpdate = editingProductId !== null;

    const response = await fetch(
      isUpdate
        ? `${BASE_URL}/store/admin/products/${editingProductId}`
        : `${BASE_URL}/store/admin/products`,
      {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok || result.status !== "success") {
      throw new Error(result.message || "Failed to save product");
    }

    await fetchProducts();
    setIsProductsOpen(true);
    setActiveView("all-products");
    handleCloseAddProduct();

  } catch (error) {
    console.error(error.message);
  }
};

const handleAddCategorySubmit = async (event) => {
  event.preventDefault();
  if (!newCategory.name.trim()) return;

  const payload = {
    name: newCategory.name.trim(),
    baseCategory: newCategory.baseCategory.trim() || "N/A",
    brands: newCategory.brands.trim() || "N/A",
    priority: Number(newCategory.priority || 0),
    theme: newCategory.theme.trim() || "General",
  };

  try {
    const isUpdate = editingCategoryId !== null;

    const response = await fetch(
      isUpdate
        ? `${BASE_URL}/store/admin/categories/${editingCategoryId}`
        : `${BASE_URL}/store/admin/categories`,
      {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok || result.status !== "success") {
      throw new Error(result.message || "Failed to save category");
    }

    await fetchCategories();
    setIsProductsOpen(true);
    setActiveView("all-categories");
    handleCloseAddCategory();

  } catch (error) {
    console.error(error.message);
  }
};

  const filteredProductRows = productRows.filter((item) => {
    const queryA = productsSearch.trim().toLowerCase();
    const queryB = topProductsSearch.trim().toLowerCase();
    const rowText = `${item.name} ${item.brand} ${item.categories} ${item.themes}`.toLowerCase();
    return (!queryA || rowText.includes(queryA)) && (!queryB || rowText.includes(queryB));
  });

  const filteredCategoryRows = categoryRows.filter((item) => {
    const query = categoriesSearch.trim().toLowerCase();
    const rowText = `${item.name} ${item.baseCategory} ${item.brands} ${item.theme}`.toLowerCase();
    return !query || rowText.includes(query);
  });

  const renderMiniGraph = (trend, graphClass) => (
    <div className={`spark-chart ${graphClass}`} key={`${graphClass}-${trendKey}`}>
      {trend.map((height, index) => (
        <i key={`${graphClass}-${index}`} style={{ "--h": `${height}%` }} />
      ))}
    </div>
  );

  const renderMiniWave = (trend, waveClass) => {
    const miniWavePoints = trend
      .map((value, index) => {
        const x = 5 + index * 18;
        const y = 100 - value;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div className={`mini-wave ${waveClass}`} key={`${waveClass}-${trendKey}`}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path className="mini-wave-fill" d={`M ${miniWavePoints} L 95,100 L 5,100 Z`} />
          <polyline className="mini-wave-line" points={miniWavePoints} />
        </svg>
      </div>
    );
  };

  const renderQuickIcon = (iconType) => {
    if (iconType === "orders") {
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="M8 9h8M8 13h8" />
        </svg>
      );
    }
    if (iconType === "pending") {
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    }
    if (iconType === "processing") {
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 6v5h-5" />
          <path d="M4 18v-5h5" />
          <path d="M7 9a7 7 0 0 1 12-3" />
          <path d="M17 15a7 7 0 0 1-12 3" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12l2.5 2.5L16 9" />
      </svg>
    );
  };

  const salesWavePoints = salesTrend
    .map((value, index) => {
      const x = 8 + index * 16;
      const y = 100 - value;
      return `${x},${y}`;
    })
    .join(" ");
  const salesAmount = totalEarning > 0 ? totalEarning : 780980.03;
  const salesAxisValues = useMemo(() => {
    const max = Math.max(salesAmount, 1000);
    const top = Math.ceil(max / 1000) * 1000;
    const step = top / 5;
    return [5, 4, 3, 2, 1, 0].map((multiplier) =>
      String(Math.round(step * multiplier))
    );
  }, [salesAmount]);

  const categoryCircleStyle = {
    strokeDasharray: "100 100",
  };
  let circleOffset = 0;

  const renderDashboardContent = () => (
    <>
      <section className="utility-top">
        <div className="dashboard-search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.65" y1="16.65" x2="21" y2="21" />
          </svg>
          <input type="text" placeholder="Search bar" />
        </div>
        <div className="utility-actions">
          <button type="button" className="utility-link">Visit Store</button>
          <button type="button" className="utility-chip">English</button>
          <button type="button" className="utility-chip">$ USD</button>
          <button
            type="button"
            className="utility-icon-btn"
            aria-label="Toggle dark and light mode"
            onClick={() => setIsDarkMode((prev) => !prev)}
            title={isDarkMode ? "Light mode" : "Dark mode"}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {isDarkMode ? <circle cx="12" cy="12" r="5" /> : <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 1 0 9.8 9.8z" />}
            </svg>
          </button>
          <button type="button" className="utility-icon-btn" aria-label="Notifications">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16z" />
              <path d="M10 20a2 2 0 0 0 4 0" />
            </svg>
          </button>
          <div className="utility-profile">
            <img src={adminAvatar} alt="Admin" className="profile-avatar-img" />
            <div>
              <strong>Admin</strong>
              <small>Profile</small>
            </div>
          </div>
        </div>
      </section>

      <header className="main-top">
        <div className="mini-title">
         
          <strong>Admin Dashboard</strong>
         
        </div>
        <div className="top-actions">
          <button type="button" className="tool-btn secondary-btn">Manage States</button>
          <button type="button" className="tool-btn add-btn" onClick={handleOpenAddProduct}>Add Product</button>
          <button type="button" onClick={handleLogout} className="publish-btn">Logout</button>
        </div>
      </header>

      <section className="dashboard-top-grid">
        <div className="dashboard-main-stack">
          <section className="headline-row">
            <article className="small-card primary">
              <span>Total Products</span>
              <h3>{totalProducts}</h3>
              <p>Live count from backend</p>
              {renderMiniGraph(productTrend, "orders-graph")}
            </article>

            <article className="small-card">
              <span>Total Categories</span>
              <h3>{totalCategories}</h3>
              <p>Top category sales</p>
              <div className="category-overview">
                <div className="category-donut">
                  <svg viewBox="0 0 44 44" aria-hidden="true">
                    <circle className="donut-track" cx="22" cy="22" r="15.9" pathLength="100" />
                    {categorySalesData.map((item, index) => {
                      const arc = (
                        <circle
                          key={`category-arc-${index}`}
                          cx="22"
                          cy="22"
                          r="15.9"
                          pathLength="100"
                          className="donut-arc"
                          style={{
                            ...categoryCircleStyle,
                            stroke: item.color,
                            strokeDasharray: `${item.share} ${100 - item.share}`,
                            strokeDashoffset: -circleOffset,
                          }}
                        />
                      );
                      circleOffset += item.share;
                      return arc;
                    })}
                  </svg>
                </div>
                <ul className="donut-legend">
                  {categorySalesData.map((item) => (
                    <li key={`category-lg-${item.name}`}>
                      <em style={{ background: item.color }} />
                      <span>{item.name}</span>
                      <strong>{item.share}%</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <article className="small-card">
              <span>Total Earning</span>
              <h3>{formatPrice(totalEarning)}</h3>
              <p>Auto updated by products</p>
              {renderMiniWave(earningTrend, "earning-mini-wave")}
            </article>
          </section>

          <section className="mid-grid">
            <article className="panel sale-chart">
              <div className="panel-head sale-panel-head">
                <div>
                  <small>Sales This Month</small>
                  <h4>{formatPrice(salesAmount)}</h4>
                </div>
              </div>
              <div className="area-chart">
                <ul className="chart-y-axis">
                  {salesAxisValues.map((value, index) => (
                    <li key={`axis-${index}`}>{value}</li>
                  ))}
                </ul>
                <div className="chart-wave-wrap">
                  <svg className="wave-chart" viewBox="0 0 100 100" preserveAspectRatio="none" key={`sale-wave-${trendKey}`}>
                    <path className="wave-fill" d={`M ${salesWavePoints} L 88,100 L 8,100 Z`} />
                    <polyline className="wave-line" points={salesWavePoints} />
                    {salesTrend.map((value, index) => {
                      const x = 8 + index * 16;
                      const y = 100 - value;
                      return <circle key={`sale-dot-${trendKey}-${index}`} className="wave-dot" cx={x} cy={y} r="1.6" />;
                    })}
                  </svg>
                </div>
              </div>
            </article>
          </section>
        </div>

        <aside className="top-selling-wrap">
          <article className="small-card top-selling-card">
            <span>Top Selling Products</span>
            <p className="top-selling-subtext">Live list from your products</p>
            <ul className="top-selling-list">
              {topSellingProducts.map((item) => (
                <li key={`top-selling-${item.name}-${item.brand}`}>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.brand}</small>
                  </div>
                  <b>[{item.soldUnits}]</b>
                </li>
              ))}
            </ul>
          </article>
        </aside>
      </section>

      <section className="quick-cards">
        {topCards.map((card) => (
          <article className="quick-card" key={card.label}>
            <div className="quick-icon">{renderQuickIcon(card.icon)}</div>
            <div>
              <strong>{card.value}</strong>
              <p>{card.label}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="panel order-table-panel">
        <div className="panel-head with-btn">
          <h4>Recent Orders</h4>
          <button type="button" className="table-btn">&#128065; View All</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>PRODUCT</th>
                <th>STATUS</th>
                <th>PRICE</th>
                <th>JOINED DATE</th>
                <th>TYPE</th>
                <th>LAST PAGE VIEW</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((row) => (
                <tr key={row.order}>
                  <td>{row.order}</td>
                  <td>{row.customer}</td>
                  <td>{row.product}</td>
                  <td><span className={`chip ${row.status.toLowerCase()}`}>{row.status}</span></td>
                  <td>{row.price}</td>
                  <td>{row.joined}</td>
                  <td><span className={`chip type ${row.type.toLowerCase()}`}>{row.type}</span></td>
                  <td>{row.page}</td>
                  <td>&gt;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </>
  );

  const renderMediaFilesPanel = () => (
    <section className="panel media-files-panel">
      <div className="panel-head with-close">
        <h4>Media Files</h4>
        <button type="button" className="media-close-btn" aria-label="Close media files panel">x</button>
      </div>

      <div className="media-upload-grid">
        <article className="media-column">
          <h5>Recently uploaded files</h5>
          <div className="media-empty-state">No files uploaded recently.</div>
        </article>

        <article className="media-column">
          <h5>Add files here</h5>
          <div className="media-dropzone">
            <p>Drop files here or <span>browse files</span></p>
            <div className="media-device-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="5" width="16" height="12" rx="2" />
                <path d="M10 19h4" />
              </svg>
              <small>My Device</small>
            </div>
          </div>
        </article>
      </div>

      <div className="media-footer">
        <strong>Previously uploaded files</strong>
        <div className="media-search-wrap">
          <input type="text" placeholder="Search by name" />
          <button type="button">Search</button>
        </div>
      </div>
    </section>
  );

  const renderProductsContent = () => (
    <section className="products-view">
      <div className="products-top-strip">
        <input
          type="text"
          placeholder="Search products..."
          value={topProductsSearch}
          onChange={(event) => setTopProductsSearch(event.target.value)}
        />
      </div>

      <div className="products-page-head">
        <h3>Products</h3>
        <div className="products-head-actions">
          <button type="button" className="export-btn">Export</button>
          <button type="button" className="import-btn">Import</button>
          <button type="button" className="add-btn" onClick={handleOpenAddProduct}>+ Add Product</button>
        </div>
      </div>

      <div className="products-filters">
        <input
          type="text"
          placeholder="Search"
          value={productsSearch}
          onChange={(event) => setProductsSearch(event.target.value)}
        />
        <button type="button" className="filter-btn">Select Brand</button>
        <button type="button" className="filter-btn">Select Status</button>
        <button type="button" className="filter-btn">Search</button>
      </div>

      <div className="panel products-table-panel">
        <div className="table-wrap">
          <table className="products-table">
            <thead>
              <tr>
                <th>S/L</th>
                <th>Product Name</th>
                <th>Brand</th>
                <th>Categories</th>
                <th>Price</th>
                <th>Published</th>
                <th>Themes</th>
                <th>Is Featured</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {productsLoading ? (
                <tr><td colSpan="9">Loading products...</td></tr>
              ) : filteredProductRows.length === 0 ? (
                <tr><td colSpan="9">No products found</td></tr>
              ) : (
                filteredProductRows.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.brand}</td>
                    <td>{item.categories}</td>
                    <td className="price-text">{formatPrice(item.price)}</td>
                    <td><span className={`mini-toggle ${item.published ? "on" : ""}`} /></td>
                    <td><button type="button" className="theme-disabled-btn" disabled>{item.themes}</button></td>
                    <td><span className={`mini-toggle ${item.featured ? "on" : ""}`} /></td>
                    <td>
                      <div className="action-wrap">
                        <button type="button" className="action-btn edit" onClick={() => handleEditProduct(item)}>Update</button>
                        <button type="button" className="action-btn delete" onClick={() => handleDeleteProduct(item._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="products-footer">
          <span>Showing 1-{filteredProductRows.length} of {totalProducts} results</span>
          <div className="pager"><button type="button" className="page-btn active">1</button></div>
        </div>
      </div>
    </section>
  );

  const renderCategoriesContent = () => (
    <section className="products-view">
      <div className="products-page-head">
        <h3>Categories</h3>
        <div className="products-head-actions">
          <button type="button" className="add-btn" onClick={handleOpenAddCategory}>+ Add Category</button>
        </div>
      </div>

      <div className="products-filters categories-filters">
        <input
          type="text"
          placeholder="Search categories"
          value={categoriesSearch}
          onChange={(event) => setCategoriesSearch(event.target.value)}
        />
        <button type="button" className="filter-btn">Search</button>
      </div>

      <div className="panel products-table-panel">
        <div className="table-wrap">
          <table className="products-table">
            <thead>
              <tr>
                <th>S/L</th>
                <th>Category Name</th>
                <th>Base Category</th>
                <th>Brands</th>
                <th>Priority</th>
                <th>Theme</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {categoriesLoading ? (
                <tr><td colSpan="7">Loading categories...</td></tr>
              ) : filteredCategoryRows.length === 0 ? (
                <tr><td colSpan="7">No categories found</td></tr>
              ) : (
                filteredCategoryRows.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.baseCategory}</td>
                    <td>{item.brands}</td>
                    <td>{item.priority}</td>
                    <td><button type="button" className="theme-disabled-btn" disabled>{item.theme}</button></td>
                    <td>
                      <div className="action-wrap">
                        <button type="button" className="action-btn edit" onClick={() => handleEditCategory(item)}>Update</button>
                        <button type="button" className="action-btn delete" onClick={() => handleDeleteCategory(item._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="products-footer">
          <span>Showing 1-{filteredCategoryRows.length} of {totalCategories} results</span>
          <div className="pager"><button type="button" className="page-btn active">1</button></div>
        </div>
      </div>
    </section>
  );

  return (
    <div className={`admin-layout ${isDarkMode ? "theme-dark" : ""}`}>
      <aside className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`} id="admin-sidebar-nav">
        <div className="brand"><span className="brand-dot" />GrowStore</div>
        <nav className="admin-nav">
          <button className={`nav-item ${activeView === "dashboard" ? "active" : ""}`} type="button" onClick={() => handleSetActiveView("dashboard")}>Dashboard 1</button>
          <button className="nav-item nav-with-icon" type="button" onClick={handleProductsToggle} aria-expanded={isProductsOpen}>
            <span>Products</span>
            <span className={`dropdown-icon ${isProductsOpen ? "open" : ""}`}>v</span>
          </button>
          {isProductsOpen ? (
            <>
              <button className={`nav-sub-item ${activeView === "all-products" ? "sub-active" : ""}`} type="button" onClick={() => handleSetActiveView("all-products")}>All Products</button>
              <button className={`nav-sub-item ${activeView === "all-categories" ? "sub-active" : ""}`} type="button" onClick={() => handleSetActiveView("all-categories")}>All Categories</button>
              <button className="nav-sub-item" type="button">All Variations</button>
              <button className="nav-sub-item" type="button">All Brands</button>
              <button className="nav-sub-item" type="button">All Units</button>
              <button className="nav-sub-item" type="button">All Taxes</button>
            </>
          ) : null}
          <button className="nav-item" type="button">POS System</button>
          <button className="nav-item nav-with-status" type="button">
            <span>Orders</span>
            <em className="nav-badge">New</em>
          </button>
          <button className="nav-item" type="button">Stocks</button>
          <button className="nav-item" type="button">Refunds</button>
          <button className="nav-item" type="button">Rewards & Wallet</button>

          <div className="nav-group-title">Users</div>
          <button className="nav-sub-item" type="button">Customers</button>
          <button className="nav-sub-item" type="button">Employee Staffs</button>
          <button className="nav-sub-item" type="button">Delivery Men</button>

          <div className="nav-group-title">Content</div>
          <button className="nav-sub-item" type="button">Tags</button>
          <button className="nav-sub-item" type="button">Pages</button>
          <button className="nav-sub-item" type="button">Blogs</button>
          <button className="nav-sub-item" type="button">Media Manager</button>

          <div className="nav-group-title">Promotions</div>
          <button className="nav-sub-item" type="button">Newsletters</button>
          <button className="nav-sub-item" type="button">Coupons</button>
          <button className="nav-sub-item" type="button">Campaigns</button>

          <div className="nav-group-title">Fulfillment</div>
          <button className="nav-sub-item" type="button">Logistics</button>
          <button className="nav-sub-item" type="button">Shipping Zones</button>

          <div className="nav-group-title">Reports</div>
          <button className="nav-sub-item" type="button">Reports</button>

          <div className="nav-group-title">Support</div>
          <button className="nav-sub-item" type="button">Queries</button>
        </nav>
      </aside>
      {isSidebarOpen ? (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar menu"
        />
      ) : null}

      <main className="admin-main">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          aria-label="Toggle sidebar menu"
          aria-expanded={isSidebarOpen}
          aria-controls="admin-sidebar-nav"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        {activeView === "all-products" ? renderProductsContent() : activeView === "all-categories" ? renderCategoriesContent() : renderDashboardContent()}
      </main>

      {activeView === "dashboard" ? (
        <div className="global-media-panel">{renderMediaFilesPanel()}</div>
      ) : null}

      {showAddProductForm ? (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>{editingProductId !== null ? "Update Product" : "Add Product"}</h3>
            <form onSubmit={handleAddProductSubmit} className="add-product-form">
              <input name="name" placeholder="Product Name" value={newProduct.name} onChange={handleAddProductChange} />
              <input name="brand" placeholder="Brand" value={newProduct.brand} onChange={handleAddProductChange} />
              <input name="categories" placeholder="Categories (e.g. Sofa, Bed)" value={newProduct.categories} onChange={handleAddProductChange} />
              <input name="price" placeholder="Price (e.g. 1999.00)" value={newProduct.price} onChange={handleAddProductChange} />
              <input name="themes" placeholder="Themes (e.g. Furniture, Organic)" value={newProduct.themes} onChange={handleAddProductChange} />
              <label className="check-row"><input type="checkbox" name="published" checked={newProduct.published} onChange={handleAddProductChange} />Published</label>
              <label className="check-row"><input type="checkbox" name="featured" checked={newProduct.featured} onChange={handleAddProductChange} />Is Featured</label>
              <div className="modal-actions">
                <button type="button" className="tool-btn" onClick={handleCloseAddProduct}>Cancel</button>
                <button type="submit" className="add-btn">{editingProductId !== null ? "Update Product" : "Save Product"}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showAddCategoryForm ? (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>{editingCategoryId !== null ? "Update Category" : "Add Category"}</h3>
            <form onSubmit={handleAddCategorySubmit} className="add-product-form">
              <input name="name" placeholder="Category Name" value={newCategory.name} onChange={handleAddCategoryChange} />
              <input name="baseCategory" placeholder="Base Category" value={newCategory.baseCategory} onChange={handleAddCategoryChange} />
              <input name="brands" placeholder="Brands" value={newCategory.brands} onChange={handleAddCategoryChange} />
              <input name="priority" placeholder="Priority" value={newCategory.priority} onChange={handleAddCategoryChange} />
              <input name="theme" placeholder="Theme" value={newCategory.theme} onChange={handleAddCategoryChange} />
              <div className="modal-actions">
                <button type="button" className="tool-btn" onClick={handleCloseAddCategory}>Cancel</button>
                <button type="submit" className="add-btn">{editingCategoryId !== null ? "Update Category" : "Save Category"}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AdminDashboard;
