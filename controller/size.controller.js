const size = require("../models/Size.js");

exports.addSize = async (req, res) => {
  try {
    const newSize = new size(req.body);
    await newSize.save();
    res.status(201).json({
      message: "Size created successfully",
      data: newSize,
      status: true,
    });
  } catch (e) {
    return res.status(400).send({
      message: "Invalid size data",
    });
  }
};

exports.getAllSizes = async (req, res) => {
  try {
    const sizes = await size.find();
    res.send({ data: sizes, message: "Size list", status: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching sizes", error: err.message });
  }
};

exports.updateSize = async (req, res) => {
  try {
    const data = await size.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!data) return res.status(404).send({ message: "Size not found" });
    res.send({ data: data, message: "Size updated", status: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating size", error: err.message });
  }
};

exports.deleteSize = async (req, res) => {
  try {
    const data = await size.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).send({ message: "Size not found" });
    res.send({ data: data, message: "Size deleted", status: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting size", error: err.message });
  }
};
