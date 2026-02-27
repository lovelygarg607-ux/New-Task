import Productmodel from "../models/Productmodel.js";

const initialProducts = [
  { name: "Audi Sheesham Wood Dining Chair", brand: "Chair", categories: "Sofa, Bed", price: 19075, themes: "Furniture, Organic", published: true, featured: false },
  { name: "Melina Teakwood Dining Chair", brand: "Chair", categories: "Sofa, Bed", price: 3740, themes: "Furniture", published: true, featured: false },
  { name: "Rigo Wooden Dining Chair", brand: "Chair", categories: "Table, Dining Chair", price: 7225, themes: "Furniture", published: true, featured: false },
  { name: "Lexus Marble Dining Chair", brand: "Chair", categories: "Sofa, Bed", price: 8415, themes: "Furniture", published: true, featured: false },
  { name: "New York American Wooden Dining Chair", brand: "Chair", categories: "Table, Dining Chair", price: 5950, themes: "Furniture", published: true, featured: false },
  { name: "Royaloak Terence Wooden Dining Chair", brand: "Chair", categories: "Sofa, Bed", price: 4675, themes: "Furniture", published: true, featured: false },
  { name: "Wooden Showpiece Chair", brand: "Chair", categories: "Table, Dining Chair", price: 12750, themes: "Furniture", published: true, featured: false },
  { name: "Lamb & Mutton Back Bacon", brand: "Bird Wings", categories: "Fresh Chicken, Duck Meat", price: 0, themes: "Grocery, Halal Food", published: true, featured: true },
  { name: "Aged Beef Steak Beef", brand: "Bird Wings", categories: "Fresh Chicken, Duck Meat", price: 17000, themes: "Halal Food", published: true, featured: false },
  { name: "Steak Cattle Meat", brand: "Bird Wings", categories: "Fresh Beef", price: 8415, themes: "Halal Food, Organic", published: true, featured: true },
  { name: "Aged Beef Steak Beef", brand: "Bird Wings", categories: "Fresh Chicken, Fresh Mutton", price: 7480, themes: "Halal Food, Organic", published: true, featured: true },
  { name: "Aged Beef Steak Beef", brand: "Nexover", categories: "Fresh Chicken, Fresh Mutton", price: 8500, themes: "Halal Food, Organic", published: true, featured: true },
  { name: "Rib Lamb & Mutton Meat", brand: "Bird Wings", categories: "Fresh Chicken", price: 5100, themes: "Halal Food", published: true, featured: false },
  { name: "Chicken Meat Buffalo Wing", brand: "Bird Wings", categories: "Fresh Beef, Duck Meat", price: 1445, themes: "Halal Food", published: true, featured: false },
  { name: "Aged Beef Steak Beef", brand: "Nexover", categories: "Fresh Chicken", price: 3740, themes: "Halal Food", published: true, featured: false },
];

const ensureSeedProducts = async () => {
  const count = await Productmodel.countDocuments();
  if (count === 0) {
    await Productmodel.insertMany(initialProducts);
  }
};

const listProducts = async (req, res) => {
  try {
    await ensureSeedProducts();
    const limit = Math.min(Math.max(Number(req.query.limit) || 15, 1), 50);
    const page = Math.max(Number(req.query.page) || 1, 1);

    const products = await Productmodel.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Productmodel.countDocuments();
    return res.status(200).json({ status: "success", data: products, total, page, limit });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Unable to fetch products", error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, brand, categories, price, themes, published, featured } = req.body;
    if (!name || !brand || price === undefined || price === null || price === "") {
      return res.status(400).json({ status: "failed", message: "name, brand and price are required" });
    }

    const product = await Productmodel.create({
      name: String(name).trim(),
      brand: String(brand).trim(),
      categories: String(categories || "-").trim(),
      price: Number(price),
      themes: String(themes || "General").trim(),
      published: Boolean(published),
      featured: Boolean(featured),
    });

    return res.status(201).json({ status: "success", data: product });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Unable to create product", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, categories, price, themes, published, featured } = req.body;

    const product = await Productmodel.findByIdAndUpdate(
      id,
      {
        name: String(name).trim(),
        brand: String(brand).trim(),
        categories: String(categories || "-").trim(),
        price: Number(price),
        themes: String(themes || "General").trim(),
        published: Boolean(published),
        featured: Boolean(featured),
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ status: "failed", message: "Product not found" });
    }
    return res.status(200).json({ status: "success", data: product });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Unable to update product", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Productmodel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ status: "failed", message: "Product not found" });
    }
    return res.status(200).json({ status: "success", message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Unable to delete product", error: error.message });
  }
};

export { listProducts, createProduct, updateProduct, deleteProduct };
