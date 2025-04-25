// Initialize Ace editor and set theme
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");

// Pyodide setup to enable in-browser Python execution
let pyodide, pyodideReady = false;
async function initPyodide() {
  pyodide = await loadPyodide();
  pyodideReady = true;
}
// Start Pyodide loading immediately
initPyodide();

/**
 * Handle language selection change
 * - Switch Ace editor mode (syntax highlighting)
 * - Reload the current problem in the new language
 */
function onLanguageChange() {
  const lang = document.getElementById("lang-select").value;
  const mode = lang === "python"
    ? "ace/mode/python"
    : "ace/mode/javascript";
  editor.session.setMode(mode);
  loadProblemFromStorage();
}
 
// Data structure holding problems for each language
const problems = {
  //prob 1
  sum: {
    description: "Write a function that takes two numbers and returns their sum.",
    javascript: {
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
    python: {
      starterCode: `def sum(a, b):
    # Your code here
    pass

print(sum(3, 4))  # Expected output: 7`,
      solutionCode: `def sum(a, b):
    return a + b

print(sum(3, 4))  # Expected output: 7`,
      expectedOutput: "7"
    }
  },

  //prob 2
  factorial: {
    description: "Write a function that calculates the factorial of a number.",
    javascript: {
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
    python: {
      starterCode: `def factorial(n):
    # Your code here
    pass

print(factorial(5))  # Expected output: 120`,
      solutionCode: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # Expected output: 120`,
      expectedOutput: "120"
    }
  },

  //prob 3
  reverse: {
    description: "Write a function that reverses a string.",
    javascript: {
      starterCode: `function reverseString(str) {
  // Your code here
}

console.log(reverseString("hello")); // Expected output: "olleh"`,
      solutionCode: `function reverseString(str) {
  return str.split('').reverse().join('');
}

console.log(reverseString("hello")); // Expected output: "olleh"`,
      expectedOutput: "olleh"
    },
    python: {
      starterCode: `def reverse_string(s):
    # Your code here
    pass

print(reverse_string("hello"))  # Expected output: "olleh"`,
      solutionCode: `def reverse_string(s):
    return s[::-1]

print(reverse_string("hello"))  # Expected output: "olleh"`,
      expectedOutput: "olleh"
    }
  }
};

//saving current work function
function saveWork() {
  const sel  = localStorage.getItem("selectedProblem");
  const lang = document.getElementById("lang-select").value;
  const code = editor.getValue();
  localStorage.setItem(`draft_${sel}_${lang}`, code);
  alert("Your work has been saved!");
}

//load previouse work problem
function loadProblemFromStorage() {
  const sel  = localStorage.getItem("selectedProblem");
  const lang = document.getElementById("lang-select").value;
  const problem = problems[sel] && problems[sel][lang];
  if (!problem) {
    editor.setValue("// No problem or language selected.", -1);
    return;
  }
  // Display problem description
  document.getElementById("problem-description").textContent = problem.description;
  const key = `draft_${sel}_${lang}`;
  const saved = localStorage.getItem(key);
  editor.setValue(saved || problem.starterCode, -1);
}

//run code & display output
async function runCode() {
  const lang = document.getElementById("lang-select").value;
  const code = editor.getValue();
  const outEl = document.getElementById("output");
  outEl.textContent = "";

  if (lang === "javascript") {
    // existing JS eval logic…
    try {
      let captured = "";
      const orig = console.log;
      console.log = (...args) => { captured += args.join(" ") + "\n"; orig.apply(console, args); };
      eval(code);
      console.log = orig;
      outEl.textContent = captured || "No output.";
    } catch (e) {
      outEl.textContent = "Error: " + e.message;
    }
  }
  else if (lang === "python") {
    if (!pyodideReady) 
    {
      return outEl.textContent = "Python loading…";
    }
    try {
      // Capture everything printed to stdout
      let stdout = "";
      pyodide.setStdout({
        batched: (s) => { stdout += s}
        });
        
      
      await pyodide.runPythonAsync(code);

      pyodide.setStdout();// Reset stdout
    
      outEl.textContent = stdout.trim() || "no output.";
    } catch (err) {
      outEl.textContent = "Error: " + err;
    }
  }
}

//Replace editor contents with the official solution code
function showSolution() {
  const sel  = localStorage.getItem("selectedProblem");
  const lang = document.getElementById("lang-select").value;
  const problem = problems[sel] && problems[sel][lang];
  if (!problem) {
    alert("No problem or language selected.");
    return;
  } 
  editor.setValue(problem.solutionCode, -1);
}
//Verify user solution by comparing captured output to expectedOutput
async function verifySolution() {
  const lang = document.getElementById("lang-select").value;
  const code = editor.getValue();
  const sel = localStorage.getItem("selectedProblem");
  const problem = problems[sel] && problems[sel][lang];
  
  if (!problem) {
    alert("No problem or language selected.");
    return;
  }
  
  const expected = problem.expectedOutput.trim();
  let actual = "";

  if (lang === "javascript") {
    const originalLog = console.log;
    let captured = "";// Capture console.log for JS verification
    console.log = (...args) => {
      captured += args.join(" ") + "\n";
      originalLog.apply(console, args);
    };
    
    try {
      eval(code);
    } catch (err) {
      alert("Your code threw an error: " + err.message);
      console.log = originalLog;
      return;
    }
    
    console.log = originalLog;
    actual = captured.trim();
  }
  else if (lang === "python") {
    if (!pyodideReady) {
      alert("Python is still loading…");
      return;
    }
    try {
      // Run the Python code and take its return value (or None)
      let stdout = "";
      pyodide.setStdout({ batched: (s) => { stdout += s; } });
      await pyodide.runPythonAsync(code);
      pyodide.setStdout();

      actual = stdout.trim();
    } catch (err) {
      alert("Your code threw an error: " + err);
      return;
    }
  }
  // Alert correctness result to the user
  if (actual === expected) {
    alert("Your solution is correct!");
  } else {
    alert(
      "Your solution is incorrect.\n" +
      "Expected: " + expected + "\n" +
      "Got:      " + actual
    );
  }
}


// on load, pick the right language & code
window.onload = () => {
onLanguageChange();
};
