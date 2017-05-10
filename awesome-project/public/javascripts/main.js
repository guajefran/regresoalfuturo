$(function() {
  var params = {}

  $.ajax({
    url: "http://api.football-data.org/v1/competitions/436/fixtures?" + $.param(params),
    beforeSend: function(xhrObj){
      xhrObj.setRequestHeader("X-Auth-Token","428268f89e584636808e2596aa17bd2f")
    },
    type: "GET",
    dataType: 'json'
  })
    .done(function(data) {
      var body = $('body')
      console.log(data)
      var matches = data.fixtures
      matches.forEach(function(match){
        var row = $('<tr>')
        var homeTeam = $('<td>').text(match.homeTeamName)
        var awayTeam = $('<td>').text(match.awayTeamName)
        var result = $('<td>').text(match.result.goalsHomeTeam+' - '+match.result.goalsAwayTeam)
        var date = $('<td>').text(match.date)
        row.append(homeTeam).append(awayTeam).append(result).append(date)
        $('table').append(row)
      })
      alert("success")
    })
    .fail(function() { alert("error") })
})
