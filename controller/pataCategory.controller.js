const CategoryModel = require("../models/Category.model");
const subCategory = require("../models/SubCategory.model");
const PataCategory = require("../models/PataCategory.model");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const SubCategoryModel = require("../models/SubCategory.model");
exports.createPataCategory = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, status, category, subCategory, image } = req.body;

    if (!name || !status || !category || !subCategory || !image) {
      return res.status(400).send({
        message: "Name, status, and category,subCategory,image are required",
        status: false,
      });
    }

    const categoryExists = await CategoryModel.findById({ _id: category });
    const subCategoryExists = await SubCategoryModel.findById({
      _id: subCategory,
    });

    if (!categoryExists || !subCategoryExists) {
      return res.status(404).send({
        message: "Category or subCategory not found",
        status: false,
      });
    }

    const newPataCategory = await PataCategory.create(
      [{ name, status, category, subCategory }],
      {
        session,
      }
    );
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: "ecommerce/pataCategory",
    });

    const updatedPataCategory = await PataCategory.findByIdAndUpdate(
      newPataCategory[0]._id,
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
      message: "PataCategory created successfully",
      data: updatedPataCategory,
      status: true,
    });
  } catch (error) {
    console.error("Error creating PataCategory:", error.message);
    res.status(500).send({
      message: "Server error. Please try again later.",
      error: error.message,
      status: false,
    });
  }
};

exports.getPataCategories = async (req, res) => {
  try {
    const pataCategories = await PataCategory.find().populate([
      { path: "category" },
      {
        path: "subCategory",
      },
    ]);
    res.send({
      message: "PataCategory list",
      data: pataCategories,
      status: true,
    });
  } catch (error) {
    console.error("Error fetching PataCategories:", error.message);
    res.status(500).send({
      message: "Server error. Please try again later.",
      error: error.message,
      status: false,
    });
  }
};

exports.updatePataCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, category, subCategory, image } = req.body;

    if ((!name && !status && !category) || !subCategory || !image) {
      return res
        .status(400)
        .send(
          "Name or status or category or subCategory or image are required"
        );
    }

    const exitsPataCategory = await PataCategory.findById(id);
    if (!exitsPataCategory) {
      return res.status(404).send("Pata Category not found");
    }

    const updatedPataCategoryData = await PataCategory.findByIdAndUpdate(
      id,
      { name, status, category, subCategory },
      { new: true }
    );

    if (!updatedPataCategoryData) {
      return res.status(500).send("Failed to update category");
    }

    let updatedImage = exitsPataCategory.image;
    if (image) {
      try {
        if (exitsPataCategory.image?.id) {
          await cloudinary.uploader.destroy(exitsPataCategory.image.id);
        }

        const uploadedResponse = await cloudinary.uploader.upload(image, {
          folder: "ecommerce/pataCategory",
        });

        updatedImage = {
          id: uploadedResponse.public_id,
          url: uploadedResponse.secure_url,
        };

        updatedPataCategoryData.image = updatedImage;
        await updatedPataCategoryData.save();
      } catch (imageError) {
        console.error("Image update failed:", imageError.message);
        return res
          .status(500)
          .send("Pata Category updated but failed to update image");
      }
    }

    res.send({
      message: "PataCategory updated successfully",
      data: updatedPataCategoryData,
      status: true,
    });
  } catch (e) {
    console.error("Error updating category:", e.message);
    res.status(500).send("Server Error");
  }
};

exports.deletePataCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const pataCategory = await PataCategory.findByIdAndDelete(id);
    if (!pataCategory) {
      return res.status(404).send("pataCategory not found");
    }
    if (pataCategory.image?.id) {
      await cloudinary.uploader.destroy(pataCategory.image.id);
    }
    res.send({
      message: "pataCategory deleted successfully",
      data: pataCategory,
      status: true,
    });
  } catch (error) {
    console.error("Error deleting PataCategory:", error.message);
    res.status(500).send({
      message: "Server error. Please try again later.",
      error: error.message,
      status: false,
    });
  }
};
