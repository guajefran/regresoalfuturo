const express = require('express');
const router  = express.Router();
const Match = require('../models/Match.js')
const Team = require('../models/Team.js')

router.get('/', (req, res, next) => {
  Match.find({status: {$ne: 'FINISHED'}}, (err, matches) => {
    if (err) { return next(err) }
    return res.render('index', {matches: matches});
  }).sort({date: 1}).limit(10)
})

function getLastMatchesWithIds(id1, id2){
  return Match.find({
    status: 'FINISHED',
    $or:[
      {'homeTeam': id1},
      {'awayTeam': id2}
    ]
  }).sort({date:-1}).limit(5)
}
function getLastCommonMatchesWithIds(id1, id2){
  return Match.find({
    status: 'FINISHED',
    $or:[
      {'homeTeam': id1, 'awayTeam': id2},
      {'homeTeam': id2, 'awayTeam': id1}
    ]
  }).sort({date:-1}).limit(5)
}

function getTeam(id){
  return Team.findById(id)
}

router.get('/head2head/', (req, res, next) =>{
  var homeTeam = req.query.hometeam
  var awayTeam = req.query.awayteam

  Promise.all([
    getLastMatchesWithIds(homeTeam,homeTeam),
    getLastMatchesWithIds(awayTeam,awayTeam),
    getLastCommonMatchesWithIds(homeTeam,awayTeam),
    getTeam(homeTeam),
    getTeam(awayTeam)
  ]).then(resultArray =>{
    const result = {
      localLast5: resultArray[0],
      visitantLast5: resultArray[1],
      commonMatches: resultArray[2],
      localTeam: resultArray[3],
      visitantTeam: resultArray[4]
    }
    res.render('head2head', result)
  })
})

module.exports = router;
