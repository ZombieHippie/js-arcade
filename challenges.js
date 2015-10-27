

var db = [
  {
    data: {
      title: "Double the value!",
      code: "function DoubleIt(n) {\n" +
        "  return n;\n" +
        "}"
    },
    tests: [
      ["DoubleIt(13)", 26],
      ["DoubleIt(14)", 28],
      ["DoubleIt(-1)", -2],
      ["DoubleIt(-.001)", -0.002]
    ]
  },
  {
    data: {
      title: "Is it Even?",
      code: "function IsEven(n) {\n" +
        "  return n;\n" +
        "}"
    },
    tests: [
      ["IsEven(13)", false],
      ["IsEven(14)", true],
      ["IsEven(-1)", false],
      ["IsEven(-12000)", true]
    ]
  },
  {
    data: {
      title: "Fizzbuzz!",
      instruction: "If n is divisible by 3, return \"fizz\" " +
        "if n is divisible by 5 return \"buzz\", " + 
        "if n is divisible by both 3 and 5 return \"fizzbuzz\", " +
        "else return null.",
      code: "function Fizzbuzz(n) {\n" +
        "  return \"fizzbuzz\";\n" +
        "}"
    },
    tests: [
      ["Fizzbuzz(1)", null],
      ["Fizzbuzz(3)", "fizz"],
      ["Fizzbuzz(5)", "buzz"],
      ["Fizzbuzz(7)", null],
      ["Fizzbuzz(9)", "fizz"],
      ["Fizzbuzz(12)", "fizz"],
      ["Fizzbuzz(15)", "fizzbuzz"]
    ]
  }
]

function getTestsById (cId) {
  var challenge = db[cId - 1]
  return challenge != null ? challenge.tests : null
}
function getChallengeDataById (cId) {
  var challenge = db[cId - 1]
  return challenge != null ? challenge.data : null
}

exports.getChallengeDataById = getChallengeDataById
exports.getTestsById = getTestsById
