const CategoryModel = require("../models/Category.model");
const subCategory = require("../models/SubCategory.model");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
exports.createSubCategory = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, status, category, image } = req.body;

    if (!name || !status || !category || !image) {
      return res.status(400).send({
        message: "Name, status, category,image are required",
        status: false,
      });
    }

    const categoryExists = await CategoryModel.findById({ _id: category });
    if (!categoryExists) {
      return res.status(404).send({
        message: "Category not found",
        status: false,
      });
    }

    const newSubCategory = await subCategory.create(
      [{ name, status, category }],
      {
        session,
      }
    );
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: "ecommerce/subCategory",
    });

    const updatedCategory = await subCategory.findByIdAndUpdate(
      newSubCategory[0]._id,
      {
        image: {
          id: uploadResult.public_id,
          url: uploadResult.secure_url,
        },
      },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).send({
      message: "Subcategory created successfully",
      data: updatedCategory,
      status: true,
    });
  } catch (error) {
    console.error("Error creating subcategory:", error.message);
    res.status(500).send({
      message: "Server error. Please try again later.",
      error: error.message,
      status: false,
    });
  }
};

exports.getSubCategories = async (req, res) => {
  try {
    const subcategories = await subCategory.find().populate("category");
    res.send({
      message: "Subcategory list",
      data: subcategories,
      status: true,
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error.message);
    res.status(500).send({
      message: "Server error. Please try again later.",
      error: error.message,
      status: false,
    });
  }
};

exports.getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await subCategory.findById(id);
    if (!subcategory) {
      return res.status(404).send({
        message: "Subcategory not found",
        status: false,
      });
    }
    res.send({
      message: "Subcategory retrieved successfully",
      data: subcategory,
      status: true,
    });
  } catch (error) {
    console.error("Error fetching subcategory:", error.message);
    res.status(500).send({
      message: "Server error. Please try again later.",
      error: error.message,
      status: false,
    });
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, category, image } = req.body;

    if (!name && !status && !category && !image) {
      return res
        .status(400)
        .send("Name,status,category and image are required");
    }

    const exitsSubCategory = await subCategory.findById(id);
    if (!exitsSubCategory) {
      return res.status(404).send("Category not found");
    }

    const updatedSubCategoryData = await subCategory.findByIdAndUpdate(
      id,
      { name, status, category },
      { new: true }
    );

    if (!updatedSubCategoryData) {
      return res.status(500).send("Failed to update category");
    }

    let updatedImage = exitsSubCategory.image;
    if (!image.id) {
      try {
        if (exitsSubCategory.image?.id) {
          await cloudinary.uploader.destroy(exitsSubCategory.image.id);
        }

        const uploadedResponse = await cloudinary.uploader.upload(image, {
          folder: "ecommerce/subCategory",
        });

        updatedImage = {
          id: uploadedResponse.public_id,
          url: uploadedResponse.secure_url,
        };

        updatedSubCategoryData.image = updatedImage;
        await updatedSubCategoryData.save();
      } catch (imageError) {
        console.error("Image update failed:", imageError.message);
        return res
          .status(500)
          .send("Category updated but failed to update image");
      }
    }

    res.send({
      message: "SubCategory updated successfully",
      data: updatedSubCategoryData,
      status: true,
    });
  } catch (e) {
    console.error("Error updating category:", e.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await subCategory.findByIdAndDelete(id);
    if (!subcategory) {
      return res.status(404).send("Subcategory not found");
    }
    if (subcategory.image?.id) {
      await cloudinary.uploader.destroy(subcategory.image.id);
    }
    res.send({
      message: "Subcategory deleted successfully",
      data: subcategory,
      status: true,
    });
  } catch (error) {
    console.error("Error deleting subcategory:", error.message);
    res.status(500).send({
      message: "Server error. Please try again later.",
      error: error.message,
      status: false,
    });
  }
};
