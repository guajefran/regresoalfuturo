const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const matchSchema = new Schema({
  homeTeam: Schema.Types.ObjectId,
  awayTeam: Schema.Types.ObjectId,
  date: Date,
  status: String,
  matchDay: Number,
  goalsHomeTeam: Number,
  goalsAwayTeam: Number
});

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
