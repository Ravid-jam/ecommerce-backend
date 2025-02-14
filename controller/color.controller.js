const color = require("../models/Color.js");

exports.addColor = async (req, res) => {
  try {
    const { colorName, colorCode } = req.body;
    const newColor = new color({ colorName, colorCode });
    await newColor.save();
    res.status(201).json({
      message: "Color created successfully",
      data: newColor,
      status: true,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllColors = async (req, res) => {
  try {
    const colors = await color.find();
    res.status(201).json({
      message: "Color list",
      data: colors,
      status: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateColor = async (req, res) => {
  try {
    const { id } = req.params;
    const { colorName, colorCode } = req.body;

    const existcolor = await color.findById(id);
    if (!existcolor) {
      return res.status(404).send("Color not found");
    }

    const data = await color.findByIdAndUpdate(
      id,
      {
        colorName,
        colorCode,
      },
      {
        new: true,
      }
    );
    res.status(201).json({
      message: "Color updated successfully",
      data: data,
      status: true,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteColor = async (req, res) => {
  try {
    const { id } = req.params;
    const existcolor = await color.findById(id);
    if (!existcolor) {
      return res.status(404).send("Color not found");
    }
    const data = await color.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: "Color not found" });
    res.status(201).json({
      message: "Color delete successfully",
      status: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
