const { Schema, model } = require("mongoose");


const userSchema = new Schema(
  {
    username: String,
    email: { type: String, unique: true },
    password: String,
  },
  {
    collection: 'users',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false
  }
);


module.exports = model("User", userSchema);
