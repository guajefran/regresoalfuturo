$(function() {
  function API(){
    this.URL = "http://api.football-data.org/v1/",
    this.URI = {
      teams: "competitions/436/teams",
      matches: "competitions/436/fixtures"
    }
    this.auth = {
      key: "X-Auth-Token",
      token: "428268f89e584636808e2596aa17bd2f"
    }
  }
  API.prototype.getTeams = function(){
    $.ajax({
      context: this,
      url: this.URL+this.URI.teams,
      beforeSend: function(xhrObj){
        xhrObj.setRequestHeader(this.auth.key, this.auth.token)
      }
    })
      .done(function(data) {
        var teams = data.teams
        var teamsDiv = $('.teams')
        teams.forEach(function(team){
          var teamFrame = $('<div>').addClass('team')
          teamFrame.append($('<p>').text('{ "name": "'+ team.name+'",'))
          teamFrame.append($('<p>').text('"shortName": "'+ team.shortName+'",'))
          teamFrame.append($('<p>').text('"imgUrl": "'+ team.crestUrl+'",'))
          teamFrame.append($('<p>').text('"code": "'+ team.code+'",'))
          teamFrame.append($('<p>').text('"apiId": "'+ team._links.self.href.substr(38, 2)+'"},'))
          teamsDiv.append(teamFrame)
        })
      })
      .fail(function() { alert("error") })
  }
  API.prototype.getMatches = function(){
    $.ajax({
      context: this,
      url: this.URL+this.URI.matches,
      beforeSend: function(xhrObj){
        xhrObj.setRequestHeader(this.auth.key, this.auth.token)
      }
    })
      .done(function(data){
        var matches = data.fixtures
        var matchesDiv  = $('.matches')
        matches.forEach(function(match){
          var matchFrame = $('<div>').addClass('match')
          matchFrame.append($('<p>').text('{ "date": "'+ match.date +'",'))
          matchFrame.append($('<p>').text('"status": "'+ match.status +'",'))
          matchFrame.append($('<p>').text('"matchday": "'+ match.matchday+'",'))
          matchFrame.append($('<p>').text('"goalsHomeTeam": "'+ match.result.goalsHomeTeam +'",'))
          matchFrame.append($('<p>').text('"goalsAwayTeam": "'+ match.result.goalsAwayTeam +'",'))
          matchFrame.append($('<p>').text('"homeTeamName": "'+ match.homeTeamName +'",'))
          matchFrame.append($('<p>').text('"awayTeamName": "'+ match.awayTeamName +'",'))
          matchFrame.append($('<p>').text('"homeTeam": "",'))
          matchFrame.append($('<p>').text('"awayTeam": ""},'))
          matchesDiv.append(matchFrame)
        })
      })
  }
  var api = new API()
  // api.getTeams()
  // api.getMatches()
})
