var express = require('express')
var app = express()
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var session = require('express-session')
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

console.log("dirname", __dirname)

// access localhost:3000
app.get('/', function (req, res) {
  // send index.html file
  res.sendFile(__dirname + '/index.html')
})


var vm = require('vm');

var challenges = require('./challenges.js')

app.get('/get-challenge', function (req, res) {
  var sess = req.session
  if (sess.currentChallenge == null)
    sess.currentChallenge = 1

  var challengeId = sess.currentChallenge
  //console.log(sess.id, challengeId)
  res.json(challenges.getChallengeDataById(challengeId))
})

app.post('/test-code', function (req, res) {
  var sess = req.session
  if (sess.currentChallenge == null)
    sess.currentChallenge = 1

  var reqData = req.body

  var sandbox = {
    Math: Math
  }
  vm.createContext(sandbox)

  var challengeId = req.session.currentChallenge

  try {
    vm.runInThisContext(reqData.code, sandbox)

    var isCorrect = true
    var test
    var expected

    // run tests
    var testResultPairs = challenges.getTestsById(challengeId)
    for (var index = 0; index < testResultPairs.length; index++) {
      var challengePair = testResultPairs[index]
      test = challengePair[0]
      expected = challengePair[1]
    
      var vmResult = vm.runInThisContext(test, sandbox)
      isCorrect = expected === vmResult

      if (!isCorrect)
        break

      else {
        test = null
        expected = null
      }
    }
  } catch (error) {
    res.json({
      correct: false,
      error: error.toString(),
      nextChallengeId: req.session.currentChallenge,
      test: test,
      expected: expected
    })
    return;
  }

  if (isCorrect)
    req.session.currentChallenge += 1

  res.json({
    correct: isCorrect,
    nextChallengeId: req.session.currentChallenge,
    test: test,
    expected: expected
  })
})

app.listen(3000)