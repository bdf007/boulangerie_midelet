const mongoose = require("mongoose");
const uuidv1 = require("uuidv1");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    firstname: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    lastname: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: "user",
    },
    hashed_password: {
      type: String,
      required: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    updated: Date,
    salt: String,
  },
  { timestamps: true }
);

// virtual field
userSchema
  .virtual("password")
  .set(function (password) {
    // create a temporary variable called _password
    this._password = password;
    // generate a timestamp
    this.salt = uuidv1();
    // encryptPassword()
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
userSchema.methods = {
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
};

module.exports = mongoose.model("User", userSchema);
