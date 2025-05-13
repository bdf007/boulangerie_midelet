const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
    },
    photo: {
      type: String,
      trim: true,
    },
    activeAbout: {
      type: Boolean,
      default: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    updated: Date,
  },
  { timestamps: true }
);
module.exports = mongoose.model("About", aboutSchema);
