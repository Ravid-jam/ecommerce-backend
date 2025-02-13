const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    pataCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PataCategory",
      required: false,
    },
    brandName: { type: String, required: true },
    returnPolicy: { type: String, required: true },
    brandDetails: { type: String, required: true },
    shipping: { type: String, required: true },
    deliveryDetail: { type: String, required: true },
    productDetail: { type: String, required: true },
    color: { type: String },
    Offers: [{ type: String }],
    size: [
      {
        name: { type: String },
        totalStock: {
          type: Number,
          required: false,
          min: 0,
        },
        availableStock: {
          type: Number,
          required: true,
          min: 0,
          default: 0,
        },
      },
    ],
    images: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    totalStock: { type: Number, required: false },
    rating: { type: Number, default: 0 },
    stock: {
      type: Number,
      required: false,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
