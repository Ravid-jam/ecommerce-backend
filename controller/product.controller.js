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

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate(
      "category subcategory pataCategory color"
    );
    res.send({ data: products, message: "Product List", status: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: err.message });
  }
};

exports.getSingleProduct = async (req, res) => {
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
      images, // Incoming images from request
      totalStock,
      rating,
      stock,
    } = req.body;

    const totalPrice = price - (price * (discount || 0)) / 100;

    // Find the existing product
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct)
      return res.status(404).json({ message: "Product not found" });

    let uploadedImages = [];
    let existingImageIds = existingProduct.images.map((img) => img.id);

    // Process images
    if (images && Array.isArray(images)) {
      for (const image of images) {
        if (image.id && existingImageIds.includes(image.id)) {
          // If image exists in database, update it in Cloudinary
          if (image.base64) {
            const uploadResult = await cloudinary.uploader.upload(
              image.base64,
              {
                public_id: image.id, // Overwrite the existing image in Cloudinary
                folder: "ecommerce/products",
                overwrite: true,
              }
            );

            uploadedImages.push({
              id: uploadResult.public_id,
              url: uploadResult.secure_url,
            });
          } else {
            // If no base64 is provided, retain the existing image
            const existingImage = existingProduct.images.find(
              (img) => img.id === image.id
            );
            if (existingImage) uploadedImages.push(existingImage);
          }
        } else if (image.base64) {
          // If image ID is not present, upload new image
          const uploadResult = await cloudinary.uploader.upload(image.base64, {
            folder: "ecommerce/products",
          });

          uploadedImages.push({
            id: uploadResult.public_id,
            url: uploadResult.secure_url,
          });
        }
      }
    }

    // Identify images to delete (those missing from the new request)
    const newImageIds = uploadedImages.map((img) => img.id);
    const imagesToDelete = existingImageIds.filter(
      (id) => !newImageIds.includes(id)
    );

    // Delete removed images from Cloudinary
    if (imagesToDelete.length > 0) {
      for (const publicId of imagesToDelete) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Update product details in the database
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
        totalStock,
        rating,
        stock,
        images: uploadedImages, // Updated images list
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
      status: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating product",
      error: err.message,
      status: false,
    });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: err.message });
  }
};
