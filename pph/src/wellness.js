// wellness.js

// once the DOM is loaded...
document.addEventListener('DOMContentLoaded', () => {
  // buttons inside #wellness-pod
  document
    .getElementById('wellness-opt1')
    .addEventListener('click', handleAnswer);
  document
    .getElementById('wellness-opt2')
    .addEventListener('click', handleAnswer);
});

function handleAnswer() {
  // Optional: you could read which button, show a “Thanks!” message, etc.
  alert("Thanks for checking in! You're on your way back to Power Hour.");
  // Now call back into game logic:
  window.returnFromPod();
}
