import Categorymodel from "../models/Categorymodel.js";

const initialCategories = [
  { name: "Fresh Chicken", baseCategory: "N/A", brands: "N/A", priority: 1, theme: "Halal Food, Organic" },
  { name: "Chair", baseCategory: "N/A", brands: "N/A", priority: 1, theme: "Furniture" },
  { name: "Cleaning", baseCategory: "N/A", brands: "N/A", priority: 0, theme: "Grocery, Organic" },
  { name: "Breakfast", baseCategory: "N/A", brands: "N/A", priority: 0, theme: "Grocery, Organic" },
  { name: "Baby Care", baseCategory: "N/A", brands: "N/A", priority: 0, theme: "Grocery, Organic" },
  { name: "Pet Care", baseCategory: "N/A", brands: "N/A", priority: 0, theme: "Grocery, Organic" },
  { name: "Jam & Jelly", baseCategory: "N/A", brands: "N/A", priority: 0, theme: "Grocery, Organic" },
  { name: "Honey", baseCategory: "N/A", brands: "N/A", priority: 0, theme: "Grocery, Organic" },
  { name: "Cold Drinks", baseCategory: "N/A", brands: "N/A", priority: 0, theme: "Grocery, Organic" },
  { name: "Fresh Organic", baseCategory: "N/A", brands: "N/A", priority: 0, theme: "Grocery" },
  { name: "Fresh Fruits", baseCategory: "N/A", brands: "N/A", priority: 0, theme: "Grocery" },
  { name: "Coffee Drinks", baseCategory: "N/A", brands: "N/A", priority: 0, theme: "Grocery" },
  { name: "Vegetables", baseCategory: "N/A", brands: "N/A", priority: 0, theme: "Grocery" },
  { name: "Butter", baseCategory: "N/A", brands: "N/A", priority: 0, theme: "Grocery" },
  { name: "Parent Key", baseCategory: "N/A", brands: "N/A", priority: 0, theme: "Grocery" },
];

const ensureSeedCategories = async () => {
  const count = await Categorymodel.countDocuments();
  if (count === 0) {
    await Categorymodel.insertMany(initialCategories);
  }
};

const listCategories = async (req, res) => {
  try {
    await ensureSeedCategories();
    const limit = Math.min(Math.max(Number(req.query.limit) || 15, 1), 50);
    const page = Math.max(Number(req.query.page) || 1, 1);

    const categories = await Categorymodel.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Categorymodel.countDocuments();
    return res.status(200).json({ status: "success", data: categories, total, page, limit });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Unable to fetch categories", error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, baseCategory, brands, priority, theme } = req.body;
    if (!name) {
      return res.status(400).json({ status: "failed", message: "name is required" });
    }

    const category = await Categorymodel.create({
      name: String(name).trim(),
      baseCategory: String(baseCategory || "N/A").trim(),
      brands: String(brands || "N/A").trim(),
      priority: Number(priority || 0),
      theme: String(theme || "General").trim(),
    });

    return res.status(201).json({ status: "success", data: category });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Unable to create category", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, baseCategory, brands, priority, theme } = req.body;

    const category = await Categorymodel.findByIdAndUpdate(
      id,
      {
        name: String(name).trim(),
        baseCategory: String(baseCategory || "N/A").trim(),
        brands: String(brands || "N/A").trim(),
        priority: Number(priority || 0),
        theme: String(theme || "General").trim(),
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ status: "failed", message: "Category not found" });
    }
    return res.status(200).json({ status: "success", data: category });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Unable to update category", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Categorymodel.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ status: "failed", message: "Category not found" });
    }
    return res.status(200).json({ status: "success", message: "Category deleted" });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Unable to delete category", error: error.message });
  }
};

export { listCategories, createCategory, updateCategory, deleteCategory };
