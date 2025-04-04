var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
editor.setValue("// Loading...");
function changeLanguage() {
  const lang = document.getElementById("language-select").value;
  editor.session.setMode("ace/mode/" + lang);
  localStorage.setItem("selectedLanguage", lang);
  loadProblemFromStorage();
}

const problems = {
  sum: {
    description: "Write a function that takes two numbers and returns their sum.",
    javascript: {
      starterCode: `function sum(a, b) {\n  // Your code here\n}\n\nconsole.log(sum(3, 4));`,
      solutionCode: `function sum(a, b) {\n  return a + b;\n}\n\nconsole.log(sum(3, 4));`,
      expectedOutput: "7"
    },
    python: {
      starterCode: `def sum_two_numbers(a, b):
        # Your code here
    
    print(sum_two_numbers(3, 4))`,
      solutionCode: `def sum_two_numbers(a, b):
        return a + b
    
    print(sum_two_numbers(3, 4))`,
      expectedOutput: "7"
    },    
    c_cpp: {
      starterCode: `#include <stdio.h>\n\nint sum(int a, int b) {\n  // Your code here\n}\n\nint main() {\n  printf("%d", sum(3, 4));\n  return 0;\n}`,
      solutionCode: `#include <stdio.h>\n\nint sum(int a, int b) {\n  return a + b;\n}\n\nint main() {\n  printf("%d", sum(3, 4));\n  return 0;\n}`,
      expectedOutput: "7"
    }
  },  
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
  
  console.log(factorial(5));`,
      expectedOutput: "120"
    },
    python: {
      starterCode: `def factorial(n):
      # Your code here
  
  print(factorial(5))`,
      solutionCode: `def factorial(n):
      if n <= 1:
          return 1
      return n * factorial(n - 1)
  
  print(factorial(5))`,
      expectedOutput: "120"
    },
    c_cpp: {
      starterCode: `#include <stdio.h>
  
  int factorial(int n) {
    // Your code here
  }
  
  int main() {
    printf("%d", factorial(5));
    return 0;
  }`,
      solutionCode: `#include <stdio.h>
  
  int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  }
  
  int main() {
    printf("%d", factorial(5));
    return 0;
  }`,
      expectedOutput: "120"
    }
  },  
  reverse: {
    description: "Write a function that reverses a string.",
    javascript: {
      starterCode: `function reverseString(str) {
    // Your code here
  }
  
  console.log(reverseString("hello"));`,
      solutionCode: `function reverseString(str) {
    return str.split('').reverse().join('');
  }
  
  console.log(reverseString("hello"));`,
      expectedOutput: "olleh"
    },
    python: {
      starterCode: `def reverse_string(s):
      # Your code here
  
  print(reverse_string("hello"))`,
      solutionCode: `def reverse_string(s):
      return s[::-1]
  
  print(reverse_string("hello"))`,
      expectedOutput: "olleh"
    },
    c_cpp: {
      starterCode: `#include <stdio.h>
  #include <string.h>
  
  void reverse(char* str) {
    // Your code here
  }
  
  int main() {
    char str[] = "hello";
    reverse(str);
    printf("%s", str);
    return 0;
  }`,
      solutionCode: `#include <stdio.h>
  #include <string.h>
  
  void reverse(char* str) {
    int len = strlen(str);
    for (int i = 0; i < len / 2; i++) {
      char temp = str[i];
      str[i] = str[len - i - 1];
      str[len - i - 1] = temp;
    }
  }
  
  int main() {
    char str[] = "hello";
    reverse(str);
    printf("%s", str);
    return 0;
  }`,
      expectedOutput: "olleh"
    }
  }
};  


function saveWork() {//function called by button press
  const code = editor.getValue();
  const selected = localStorage.getItem("selectedProblem");
  if (selected) {
    const lang = localStorage.getItem("selectedLanguage") || "javascript";
    localStorage.setItem(`draft_${selected}_${lang}`, code);
    alert("Your work has been saved!");
  } else {
    alert("No problem selected to save.");
  }
}

function loadProblemFromStorage() {
  const selected = localStorage.getItem("selectedProblem");
  const lang = localStorage.getItem("selectedLanguage") || "javascript";
  const problem = problems[selected];

  if (problem && problem[lang]) {
    document.getElementById("problem-description").textContent = problem.description;
    const savedCode = localStorage.getItem(`draft_${selected}_${lang}`);
    if (savedCode) {
      editor.setValue(savedCode, -1);
    } else {
      editor.setValue(problem[lang].starterCode, -1);
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
    const lang = localStorage.getItem("selectedLanguage") || "javascript";
    editor.setValue(problem[lang].solutionCode, -1);
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
  const lang = localStorage.getItem("selectedLanguage") || "javascript";
    if (capturedOutput.trim() === problem[lang].expectedOutput.trim()){
    alert("Your solution is correct!");
  } else {
    alert("Your solution is incorrect.\nExpected: " + problem.expectedOutput + "\nGot: " + capturedOutput.trim());
  }
}



window.onload = function () {
  const lang = localStorage.getItem("selectedLanguage") || "javascript";
  document.getElementById("language-select").value = lang;
  editor.session.setMode("ace/mode/" + lang);
  loadProblemFromStorage();
};

