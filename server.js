var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var fs = require('fs')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

 
var session = require('express-session')
var FileStore = require('session-file-store')(session);
app.use(session({
    store: new FileStore(),
    secret: 'keyboard cat'
}));

var highscores = []

// access localhost:3000
app.get('/', function (req, res) {
  if (req.session.currentGame == null) {
    // if haven't started game, send start game file

    // get contents of start-game.html
    var templateStartGame = fs.readFileSync(__dirname + '/start-game.html', "utf8")

    // create string of highscores
    var highscoresDisplay = "  Name            | Time\n"
    highscoresDisplay += "  " + Array(17).join("-") + "+" + Array(17).join("-") + "\n"
    highscores.forEach(function (item, index) {
      var rightPadding = Array(17 - item.name.length).join(" ")
      highscoresDisplay += (index + 1) + " " +  item.name + rightPadding + "| " + item.time + "s\n"
    })

    // send start-game.html with highscores replaced
    res.send(templateStartGame.replace("INSERT HIGHSCORES", highscoresDisplay))

    res.end()
  }
  else
    // if is in game, send index.html file (playing file)
    res.sendFile(__dirname + '/index.html')
})

// access localhost:3000
app.get('/start-game', function (req, res) {
  // set-up new game and redirect to /
  req.session.regenerate(function () {
    req.session.currentGame = {
      currentChallenge: 1,
      isGameOver: false,
      completedChallenges: [],
      startTime: Date.now()
    }
    res.redirect('/')
  })
})

// access localhost:3000
app.get('/game-over', function (req, res) {
  // if game hasn't started or game isn't over, redirect to /
  if(req.session.currentGame == null
    || req.session.currentGame.isGameOver == false)
    res.redirect("/")

  else {
    // send game-over.html file
    var duration = (Date.now() - req.session.currentGame.startTime) * .001
    req.session.currentGame.time = duration
    
    // get contents of game-over.html
    var templateGameOver = fs.readFileSync(__dirname + '/game-over.html', "utf8")

    // send game-over.html with highscores replaced
    res.send(templateGameOver.replace("INSERT TIME", duration))

    res.end()
  }
})
// access localhost:3000
app.post('/game-over', function (req, res) {
  // if game hasn't started or game isn't over, redirect to /
  if(req.session.currentGame == null
    || req.session.currentGame.isGameOver == false
    || req.body.username == null
    || req.session.currentGame.time == null)
    res.status(400).send("could not save highscore")

  else {
    highscores.push({ name: req.body.username.slice(0,15), time: req.session.currentGame.time})
    highscores = highscores
      .sort(function(a,b){return a.time - b.time}) // sort in ascending order by time
      .slice(0,4) // keep top 5
    req.session.destroy()
    res.redirect('/')
  }
})


var vm = require('vm');

var challenges = require('./challenges.js')

app.get('/get-challenge', function (req, res) {
  var sess = req.session
  if (sess.currentGame == null)
    res.status(400).send("Session is without game started. Please start a game at /start-game")

  else {
    // send current challenge
    var challengeId = sess.currentGame.currentChallenge

    var challengeData = challenges.getChallengeDataById(challengeId)

    if (challengeData == null) {
      // game-over
      sess.currentGame.isGameOver = true
      res.json({ gameover: true })
    } else
      res.json(challengeData)
  }
})

app.post('/test-code', function (req, res) {
  var sess = req.session
  if (sess.currentGame == null) {
    res.status(400).send("Session is without game started. Please start a game at /start-game")
    return
  }
  var sessGame = req.session.currentGame

  var reqData = req.body

  var sandbox = {
    Math: Math
  }
  vm.createContext(sandbox)

  var challengeId = sessGame.currentChallenge

  var isCorrect = true
  var test
  var expected
  var result
  var testResultPairs = challenges.getTestsById(challengeId)

  if (testResultPairs == null)
    return res.status(400).send("invalid challenge id")

  try {
    vm.runInThisContext(reqData.code, sandbox)

    // run tests
    for (var index = 0; index < testResultPairs.length; index++) {
      var challengePair = testResultPairs[index]
      test = challengePair[0]
      expected = challengePair[1]
    
      result = vm.runInThisContext(test, sandbox)
      isCorrect = expected === result

      if (!isCorrect)
        break

      else {
        test = null
        expected = null
        result = null
      }
    }
  } catch (error) {
    res.json({
      correct: false,
      error: error.toString(),
      nextChallengeId: sessGame.currentChallenge,
      test: test,
      expected: expected
    })

    // done after sending error
    return;
  }

  if (isCorrect)
    sessGame.currentChallenge += 1

  res.json({
    correct: isCorrect,
    nextChallengeId: sessGame.currentChallenge,
    test: test,
    expected: expected,
    got: result
  })
})

app.listen(3000)