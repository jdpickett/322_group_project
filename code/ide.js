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

console.log(reverseString("hello")); // Expected output: "olleh"`
  }
};


function saveWork() {//function called by button press
  const code = editor.getValue();
  const selected = localStorage.getItem("selectedProblem");
  if (selected) {
    localStorage.setItem("draft_" + selected, code);
    alert("Your work has been saved!");
  } else {
    alert("No problem selected to save.");
  }
}

function loadProblemFromStorage() {
  const selected = localStorage.getItem("selectedProblem");
  const problem = problems[selected];
  if (problem) {
    document.getElementById("problem-description").textContent = problem.description;
    // Check if there is saved work for this problem
    const savedCode = localStorage.getItem("draft_" + selected);
    if (savedCode) {
      editor.setValue(savedCode, -1);
    } else {
      editor.setValue(problem.starterCode, -1);
    }
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

function verifySolution() {
  const userCode = editor.getValue();
  const selected = localStorage.getItem("selectedProblem");
  const problem = problems[selected];
  
  if (!problem) {
    alert("No problem selected.");
    return;
  }
  
  // Override console.log to capture output.
  const originalLog = console.log;
  let capturedOutput = "";
  console.log = function(...args) {
    capturedOutput += args.join(" ") + "\n";
    originalLog.apply(console, args);
  };

  try {
    // Execute the user's code.
    eval(userCode);
  } catch (error) {
    alert("Your code threw an error: " + error.message);
    console.log = originalLog;
    return;
  }
  
  // Restore original console.log.
  console.log = originalLog;
  
  // Trim outputs for a fair comparison.
  if (capturedOutput.trim() === problem.expectedOutput.trim()) {
    alert("Your solution is correct!");
  } else {
    alert("Your solution is incorrect.\nExpected: " + problem.expectedOutput + "\nGot: " + capturedOutput.trim());
  }
}



window.onload = loadProblemFromStorage;