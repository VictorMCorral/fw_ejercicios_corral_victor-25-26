const { Schema, model } = require("mongoose");

const characterSchema = new Schema(
  {
    name: String,
    img: String,
    age: Number,
    species: String,
    specialTraits: [String],
    role: String,
    firstAppearance: String,
  },
  {
    collection: 'characters',
    versionKey: false
  }
);


module.exports = model("Character", characterSchema);
