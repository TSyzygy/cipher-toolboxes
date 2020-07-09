function startEvolution () {
  message = document.getElementById("evolutionMessage").value;

}

// Runs on page load
document.addEventListener("DOMContentLoaded", function (event) {
  dataText = [
    ["title", "Toolbox A3: Evolution Algorithm"],
    ["subtitle", "Simulates natural selection to solve ciphers"]
  ]

  startTextAnimation(0);
  setupExpandInfo();
})
