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

console.log(sum(3, 4)); // Expected output: 7`,
    expectedOutput: "7"
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

console.log(factorial(5)); // Expected output: 120`,
    expectedOutput: "120"
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

console.log(reverseString("hello")); // Expected output: "olleh"`,
    expectedOutput: "olleh"
  }
};

function saveWork() {
  const code = editor.getValue();
  const selected = localStorage.getItem("selectedProblem");
  const customIndex = localStorage.getItem("selectedCustomProblem");

  if (customIndex !== null) {
    localStorage.setItem("draft_custom_" + customIndex, code);
    alert("Your custom problem work has been saved!");
  } else if (selected) {
    localStorage.setItem("draft_" + selected, code);
    alert("Your work has been saved!");
  } else {
    alert("No problem selected to save.");
  }
}

function loadProblemFromStorage() {
  const selected = localStorage.getItem("selectedProblem");
  const customIndex = localStorage.getItem("selectedCustomProblem");
  const username = localStorage.getItem("loggedInUser");

  if (customIndex !== null && username) {
    const userProblems = JSON.parse(localStorage.getItem("userProblems_" + username)) || [];
    const problem = userProblems[parseInt(customIndex)];
    if (problem) {
      document.getElementById("problem-description").textContent = problem.description;
      const savedCode = localStorage.getItem("draft_custom_" + customIndex);
      editor.setValue(savedCode || problem.starterCode, -1);
      editor.customExpectedOutput = problem.expectedOutput;
      editor.customSolutionCode = problem.solutionCode;
      return;
    }
  }

  const problem = problems[selected];
  if (problem) {
    document.getElementById("problem-description").textContent = problem.description;
    const savedCode = localStorage.getItem("draft_" + selected);
    editor.setValue(savedCode || problem.starterCode, -1);
  } else {
    document.getElementById("problem-description").textContent = "No problem selected.";
    editor.setValue("// No problem selected.");
  }
}

function runCode() {
  var code = editor.getValue();
  const outputElement = document.getElementById("output");
  outputElement.textContent = "";

  const originalLog = console.log;
  let capturedOutput = "";
  console.log = function (...args) {
    capturedOutput += args.join(" ") + "\n";
    originalLog.apply(console, args);
  };

  try {
    eval(code);
    outputElement.textContent = capturedOutput || "No output.";
  } catch (err) {
    outputElement.textContent = "Error: " + err.message;
  }

  console.log = originalLog;
}

function showSolution() {
  const selected = localStorage.getItem("selectedProblem");
  const customIndex = localStorage.getItem("selectedCustomProblem");
  const username = localStorage.getItem("loggedInUser");

  if (customIndex !== null && username) {
    const userProblems = JSON.parse(localStorage.getItem("userProblems_" + username)) || [];
    const problem = userProblems[parseInt(customIndex)];
    if (problem) {
      editor.setValue(problem.solutionCode, -1);
      return;
    }
  }

  const problem = problems[selected];
  if (problem) {
    editor.setValue(problem.solutionCode, -1);
  } else {
    alert("No problem selected.");
  }
}

function verifySolution() {
  const userCode = editor.getValue();
  const selected = localStorage.getItem("selectedProblem");
  const customIndex = localStorage.getItem("selectedCustomProblem");
  const username = localStorage.getItem("loggedInUser");

  let expectedOutput;

  if (customIndex !== null && username) {
    expectedOutput = editor.customExpectedOutput;
  } else if (selected && problems[selected]) {
    expectedOutput = problems[selected].expectedOutput;
  } else {
    alert("No problem selected.");
    return;
  }

  const originalLog = console.log;
  let capturedOutput = "";
  console.log = function (...args) {
    capturedOutput += args.join(" ") + "\n";
    originalLog.apply(console, args);
  };

  try {
    eval(userCode);
  } catch (error) {
    alert("Your code threw an error: " + error.message);
    console.log = originalLog;
    return;
  }

  console.log = originalLog;

  if (capturedOutput.trim() === expectedOutput.trim()) {
    alert("Your solution is correct!");
  } else {
    alert("Your solution is incorrect.\nExpected: " + expectedOutput + "\nGot: " + capturedOutput.trim());
  }
}

window.onload = loadProblemFromStorage;