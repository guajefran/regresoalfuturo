
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const teamSchema = new Schema({
  name: String,
  shortName: String,
  imgUrl: String,
  code: String,
  apiId: Number
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
