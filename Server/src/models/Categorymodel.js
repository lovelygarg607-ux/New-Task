import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    baseCategory: { type: String, default: "N/A", trim: true },
    brands: { type: String, default: "N/A", trim: true },
    priority: { type: Number, default: 0 },
    theme: { type: String, default: "General", trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
