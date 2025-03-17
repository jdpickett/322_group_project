//this file is for IDE-specific functionality
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
}