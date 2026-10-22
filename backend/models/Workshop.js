const mongoose = require("mongoose");

const WorkshopSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please add a workshop name"], trim: true },
    description: { type: String, required: [true, "Please add a description"], trim: true },
    instructor: { type: String, required: [true, "Please add an instructor"], trim: true },
    workshopDate: { type: Date, required: [true, "Please add a workshop date"] },
    location: { type: String, required: [true, "Please add a location"], trim: true },
    capacity: {
      type: Number,
      required: [true, "Please add a capacity"],
      min: [1, "Capacity must be at least 1"],
      validate: { validator: Number.isInteger, message: "Capacity must be an integer" },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workshop", WorkshopSchema);
