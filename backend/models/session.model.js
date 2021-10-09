//MODEL FOR SESSION OBJECT

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sessionSchema = new Schema(
  {
    campaign: {
      type: String,
      required: true,
    },
    character: {
      type: String,
      required: true,
      trim: true,
    },
    sesLog: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 4,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timeStamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
