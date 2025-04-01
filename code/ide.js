/*//this file is for IDE-specific functionality
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
editor.setValue("// Write your code here...");



function runCode() {
  // Get the code from the editor
  var code = editor.getValue();
  // For safety, consider using a sandboxed environment to run code
  try {
    var result = eval(code);
    document.getElementById("output").textContent = result;
  } catch (err) {
    document.getElementById("output").textContent = err;
  }
}*/
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
editor.setValue("// Select a problem to begin...");

const problems = {
  sum: {
    description: "Write a function that takes two numbers and returns their sum.",
    starterCode: `function sum(a, b) {
  // Your code here
  return a + b;
}

console.log(sum(3, 4)); // Expected output: 7`
  },
  factorial: {
    description: "Write a function that calculates the factorial of a number.",
    starterCode: `function factorial(n) {
  // Your code here
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log(factorial(5)); // Expected output: 120`
  },
  reverse: {
    description: "Write a function that reverses a string.",
    starterCode: `function reverseString(str) {
  // Your code here
  return str.split('').reverse().join('');
}

console.log(reverseString("hello")); // Expected output: "olleh"`
  }
};

function loadProblem() {
  const select = document.getElementById("problem-select");
  const problem = problems[select.value];
  if (problem) {
    document.getElementById("problem-description").textContent = problem.description;
    editor.setValue(problem.starterCode, -1);
  } else {
    document.getElementById("problem-description").textContent = "";
    editor.setValue("// Select a problem to begin...");
  }
}

function runCode() {
  var code = editor.getValue();
  try {
    var result = eval(code);
    document.getElementById("output").textContent = result;
  } catch (err) {
    document.getElementById("output").textContent = err;
  }
}
