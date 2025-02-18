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
    brandName: { type: String, required: false },
    returnPolicy: { type: String, required: false },
    brandDetails: { type: String, required: false },
    shipping: { type: String, required: false },
    deliveryDetail: { type: String, required: false },
    productDetail: { type: String, required: true },
    colors: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
      required: true,
    },

    Offers: [{ type: String }],
    size: [
      {
        name: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "size",
          required: false,
        },
        totalStock: {
          type: Number,
          min: 0,
        },
        availableStock: {
          type: Number,
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
