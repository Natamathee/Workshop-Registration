const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema(
  {
    workshop: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// One registration per member per workshop, including concurrent duplicate requests.
RegistrationSchema.index({ user: 1, workshop: 1 }, { unique: true });

module.exports = mongoose.model("Registration", RegistrationSchema);
