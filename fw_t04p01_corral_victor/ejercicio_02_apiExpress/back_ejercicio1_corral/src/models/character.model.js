const { Schema, model } = require("mongoose");

//TODO modificar a characters
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false
  }
);


module.exports = model("Character", characterSchema);
