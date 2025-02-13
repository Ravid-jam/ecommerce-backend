const CategoryModel = require("../models/Category.model.js");
const cloudinary = require("../config/cloudinary.js");
const mongoose = require("mongoose");
exports.CreateCategory = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, status, image } = req.body;

    if (!name) {
      return res.status(400).send("Name is required");
    } else if (!status) {
      return res.status(400).send("Status is required");
    }
    const newCategory = await CategoryModel.create([{ name, status }], {
      session,
    });

    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: "ecommerce/category",
    });

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      newCategory[0]._id,
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

    res.send({
      message: "Category created successfully",
      data: updatedCategory,
      status: true,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error creating category:", error.message);
    res.status(500).send("Server Error");
  }
};

exports.GetCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.send({ data: categories, message: "Category List", status: true });
  } catch (e) {
    res.status(500).send("Server Error");
  }
};

exports.UpdateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, image } = req.body;

    if (!name && !status) {
      return res.status(400).send("Name and status are required");
    }

    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).send("Category not found");
    }

    const updatedCategoryData = await CategoryModel.findByIdAndUpdate(
      id,
      { name, status },
      { new: true }
    );

    if (!updatedCategoryData) {
      return res.status(500).send("Failed to update category");
    }
    let updatedImage = category.image;
    if (!image.id) {
      try {
        if (category.image?.id) {
          await cloudinary.uploader.destroy(category.image.id);
        }

        const uploadedResponse = await cloudinary.uploader.upload(image, {
          folder: "ecommerce/category",
        });

        updatedImage = {
          id: uploadedResponse.public_id,
          url: uploadedResponse.secure_url,
        };

        updatedCategoryData.image = updatedImage;
        await updatedCategoryData.save();
      } catch (imageError) {
        console.error("Image update failed:", imageError.message);
        return res
          .status(500)
          .send("Category updated but failed to update image");
      }
    }

    res.send({
      message: "Category updated successfully",
      data: updatedCategoryData,
      status: true,
    });
  } catch (e) {
    console.error("Error updating category:", e.message);
    res.status(500).send("Server Error");
  }
};

exports.DeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).send("Category not found");
    }

    const deletedCategory = await CategoryModel.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(500).send("Failed to delete category");
    }

    if (category.image?.id) {
      try {
        await cloudinary.uploader.destroy(category.image.id);
      } catch (imageError) {
        console.error("Image deletion failed:", imageError.message);
        return res
          .status(500)
          .send("Category deleted but failed to delete image");
      }
    }

    res.send({
      message: "Category deleted successfully",
      data: deletedCategory,
      status: true,
    });
  } catch (e) {
    console.error("Error deleting category:", e.message);
    res.status(500).send("Server Error");
  }
};
