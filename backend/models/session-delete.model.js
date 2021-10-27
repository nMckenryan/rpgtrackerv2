// MONGODB REALM WEBHOOK MODEL FOR DELETING SESSIONS (code stored as archive, .)

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const campaignSchema = new Schema(
  {
    cName: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      trim: true,
      minlength: 3,
    },
  },
  {
    timeStamps: true,
  }
);

const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;
