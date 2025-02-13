const Product = require("../models/Product.model");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");

exports.addProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      title,
      slug,
      price,
      discount,
      category,
      subcategory,
      pataCategory,
      brandName,
      returnPolicy,
      brandDetails,
      shipping,
      deliveryDetail,
      productDetail,
      color,
      Offers,
      size,
      images,
      totalStock,
      rating,
      stock,
    } = req.body;

    const totalPrice = price - (price * (discount || 0)) / 100;

    const newProduct = new Product({
      title,
      slug,
      price,
      discount,
      totalPrice,
      category,
      subcategory,
      pataCategory,
      brandName,
      returnPolicy,
      brandDetails,
      shipping,
      deliveryDetail,
      productDetail,
      color,
      Offers,
      size,
      totalStock,
      rating,
      stock,
      images: [],
    });

    await newProduct.save({ session });

    const uploadedImages = [];
    for (const image of images) {
      if (image.base64) {
        const uploadResult = await cloudinary.uploader.upload(image.base64, {
          folder: "ecommerce/products",
        });
        uploadedImages.push({
          id: uploadResult.public_id,
          url: uploadResult.secure_url,
        });
      }
    }

    newProduct.images = uploadedImages;
    await newProduct.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Product created successfully",
      data: newProduct,
      status: true,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      message: "Error creating product",
      error: err.message,
    });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate(
      "category subcategory pataCategory"
    );
    res.send({ data: products, message: "Product List", status: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: err.message });
  }
};

// Get a single product by ID
exports.get = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category subcategory pataCategory"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: err.message });
  }
};

// Update a product
exports.updatedProduct = async (req, res) => {
  try {
    const {
      title,
      slug,
      price,
      discount,
      category,
      subcategory,
      pataCategory,
      brandName,
      returnPolicy,
      brandDetails,
      shipping,
      deliveryDetail,
      productDetail,
      color,
      Offers,
      size,
      images,
      totalStock,
      rating,
      stock,
    } = req.body;

    // Calculate total price based on discount
    const totalPrice = price - (price * (discount || 0)) / 100;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        slug,
        price,
        discount,
        totalPrice,
        category,
        subcategory,
        pataCategory,
        brandName,
        returnPolicy,
        brandDetails,
        shipping,
        deliveryDetail,
        productDetail,
        color,
        Offers,
        size,
        images,
        totalStock,
        rating,
        stock,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating product", error: err.message });
  }
};

// Delete a product
// exports.del = ete("/products/:id", async (req, res) => {
//   try {
//     const deletedProduct = await Product.findByIdAndDelete(req.params.id);
//     if (!deletedProduct)
//       return res.status(404).json({ message: "Product not found" });

//     res.status(200).json({ message: "Product deleted successfully" });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error deleting product", error: err.message });
//   }
// });
