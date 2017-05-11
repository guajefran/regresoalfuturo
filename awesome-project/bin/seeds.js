const mongoose = require('mongoose')
let Team = require('../models/Team')
let Match = require('../models/Match')

const matchesData = require('./data/matches')
const teamsData = require('./data/teams')

mongoose.connect('mongodb://localhost/awesome-project')

// Drop database
Team.collection.drop();
Match.collection.drop();

Team.create(teamsData, (err, docs) => {
  if (err) throw err
  docs.forEach( team => {
    console.log(team.name)
  })
})


var promisesArrayMatches = matchesData.map(m => {
  let promises = [
    Team.findOne({name:m.homeTeamName}),
    Team.findOne({name:m.awayTeamName})
  ];

  return Promise.all(promises).then(teams =>{
    m.homeTeam = teams[0]._id
    m.awayTeam = teams[1]._id
    if(m.goalsAwayTeam == 'null' || m.goalsHomeTeam == 'null'){
      m.goalsAwayTeam = 0;
      m.goalsHomeTeam = 0;
    }
    let match = new Match(m);
    return match.save();
  }).then( match => {
    console.log("Created match!!");
    return match;
  }).catch(e => console.log(e))
})

Promise.all(promisesArrayMatches).then(matches => {
  console.log("ALL DONE");
  mongoose.connection.close()
});
