var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
editor.setValue("// Loading...");

const problems = {
  sum: {
    description: "Write a function that takes two numbers and returns their sum.",
    starterCode: `function sum(a, b) {
  // Your code here
}

console.log(sum(3, 4)); // Expected output: 7`,
    solutionCode: `function sum(a, b) {
  return a + b;
}

console.log(sum(3, 4)); // Expected output: 7`
  },
  factorial: {
    description: "Write a function that calculates the factorial of a number.",
    starterCode: `function factorial(n) {
  // Your code here
}

console.log(factorial(5)); // Expected output: 120`,
    solutionCode: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log(factorial(5)); // Expected output: 120`
  },
  reverse: {
    description: "Write a function that reverses a string.",
    starterCode: `function reverseString(str) {
  // Your code here
}

console.log(reverseString("hello")); // Expected output: "olleh"`,
    solutionCode: `function reverseString(str) {
  return str.split('').reverse().join('');
}

console.log(reverseString("hello")); // Expected output: "olleh"`
  }
};


function loadProblemFromStorage() {
  const selected = localStorage.getItem("selectedProblem");
  const problem = problems[selected];
  if (problem) {
    document.getElementById("problem-description").textContent = problem.description;
    editor.setValue(problem.starterCode, -1);
  } else {
    document.getElementById("problem-description").textContent = "No problem selected.";
    editor.setValue("// No problem selected.");
  }
}

function runCode() {
  var code = editor.getValue();
  const outputElement = document.getElementById("output");
  outputElement.textContent = ""; // Clear previous output

  // Capture console.log
  const originalLog = console.log;
  let capturedOutput = "";
  console.log = function (...args) {
    capturedOutput += args.join(" ") + "\n";
    originalLog.apply(console, args); // Optional: still logs to browser console
  };

  try {
    eval(code);
    outputElement.textContent = capturedOutput || "No output.";
  } catch (err) {
    outputElement.textContent = "Error: " + err.message;
  }

  console.log = originalLog; // Restore original console.log
}


function showSolution() {
  const selected = localStorage.getItem("selectedProblem");
  const problem = problems[selected];
  if (problem) {
    editor.setValue(problem.solutionCode, -1);
  } else {
    alert("No problem selected.");
  }
}

window.onload = loadProblemFromStorage;
