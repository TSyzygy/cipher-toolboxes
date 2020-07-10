function startEvolution () {
  document.getElementById("startEvolutionButton").setAttribute("disabled", "true");
  document.getElementById("stopEvolutionButton").removeAttribute("disabled");
  message = document.getElementById("evolutionMessage").value;

  // Runs on completion of each generation
  function eachGen (results) {
    var genNum = results["value"][0];
    // Fills in the results every 5 generations
    if (genNum % 5 == 0) {
      document.getElementById("genNum").innerHTML = genNum;
      var location = document.getElementById("evolutionResult")
      location.innerHTML = ""; // Clears previous results
      var keysFound = results["value"][1].reverse();
      for (var result of keysFound) {
        var key = result[0];
        var node = document.createElement("LI"); // Create a <li> node
        node.appendChild(document.createTextNode(key + " " + padAfter(Math.round(result[1]), 8) + vigenereCrypt(message, key).slice(0, 30) + "...")); // Append the text to <li>
        location.appendChild(node); // Append <li> to <ul> with id="freqResult"
      }
    };
  }

  evolutionAlgorithm(eachGen, message, vigenereCrypt, quadgramScore, 9, 20, 2, 5, 200);
}

function stopEvolution () {
  evolutionRunning = false;
  document.getElementById("startEvolutionButton").removeAttribute("disabled");
  document.getElementById("stopEvolutionButton").setAttribute("disabled", "true");
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
