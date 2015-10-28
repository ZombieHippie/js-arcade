

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
      title: "Fizz, buzz, or fizzbuzz?",
      instruction: "If n is divisible by 3, return \"fizz\" " +
        "if n is divisible by 5 return \"buzz\", " + 
        "if n is divisible by both 3 and 5 return \"fizzbuzz\", " +
        "else return empty string \"\".",
      code: "function FizzBuzzOrFizzbuzz(n) {\n" +
        "  return \"fizzbuzz\";\n" +
        "}"
    },
    tests: [
      ["FizzBuzzOrFizzbuzz(1)", ""],
      ["FizzBuzzOrFizzbuzz(3)", "fizz"],
      ["FizzBuzzOrFizzbuzz(5)", "buzz"],
      ["FizzBuzzOrFizzbuzz(7)", ""],
      ["FizzBuzzOrFizzbuzz(9)", "fizz"],
      ["FizzBuzzOrFizzbuzz(12)", "fizz"],
      ["FizzBuzzOrFizzbuzz(15)", "fizzbuzz"]
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
