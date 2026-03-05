const { Schema, model } = require("mongoose");


//TODO modificar a episodes
const episodeSchema = new Schema(
    {
        code: String,
        tittle: String,
        sumary: String,
        year: Number,
        characters: [{
            type: Schema.Types.ObjectId,
            ref: 'Character'
        }]
    },
    {
        collection: 'episodes',
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        versionKey: false
    }
);

module.exports = model("Episode", episodeSchema);