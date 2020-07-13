var cipherCrypts = {
  "vigenere": vigenereCrypt,
  "transposition": transpositionCrypt
};

var scoreFunctions = {
  "quadgrams": quadgramScore,
  // "letters": letterScore
}

function startEvolution () {
  var validated = true;
  var form = document.forms["evolutionForm"];
  var message = form["message"].value;
  if (message == "") {
    validated = false;
    form["message"].classList.add("invalid");
  } else {
    form["message"].classList.remove("invalid");
  }

  // Validates cipher choice and sets decrypt function
  var cipher = form.elements["cipher"].value;
  if (cipher == "") {
    validated = false;
    document.getElementById("cipherRadio").classList.add("invalid");
  } else {
    var decryptFunction = cipherCrypts[cipher];
    document.getElementById("cipherRadio").classList.remove("invalid");
  }
  console.log(cipher);
  console.log(decryptFunction);

  var keylength = form["keylength"].value;

  // Validates cipher choice and sets decrypt function
  var fitnessName = form.elements["fitnessFunction"].value
  if (fitnessName == "") {
    validated = false;
    document.getElementById("fitnessFunctionRadio").classList.add("invalid");
  } else {
    var fitnessFunction = scoreFunctions[fitnessName];
    document.getElementById("fitnessFunctionRadio").classList.remove("invalid");
  }

  var populationSize = form["populationSize"].value;
  var birthRate = form["birthRate"].value;
  var randomPerGeneration = form["randomPerGeneration"].value;
  var generationLimit = form["generationLimit"].value;

  if (!validated) {
    return;
  }

  document.getElementById("startEvolutionButton").setAttribute("disabled", "true");
  document.getElementById("stopEvolutionButton").removeAttribute("disabled");

  // Runs on completion of each generation
  function eachGen (results) {
    var genNum = results["value"][0];
    // Fills in the results every [fillAfter] generations
    var fillAfter = 1;
    if (genNum % fillAfter == 0) {
      document.getElementById("genNum").innerHTML = genNum;
      var now = new Date;
      document.getElementById("timePassed").innerHTML = (now.getTime() - startTime) + "ms";
      var location = document.getElementById("evolutionResult")
      location.innerHTML = ""; // Clears previous results
      var keysFound = results["value"][1].reverse().slice(0, 10);
      var bestKey = keysFound[0][1];
      document.getElementById("bestDecryption").innerHTML = vigenereCrypt(message, bestKey);
      document.getElementById("bestKey").innerHTML = bestKey;
      for (var result of keysFound) {
        var key = result[1];
        var node = document.createElement("LI"); // Create a <li> node
        node.appendChild(document.createTextNode(key + " " + padAfter(Math.round(result[0]), 8))); // Append the text to <li>
        location.appendChild(node); // Append <li> to <ul> with id="freqResult"
      }
    };
    if (results["done"]) {
      document.getElementById("startEvolutionButton").removeAttribute("disabled");
      document.getElementById("stopEvolutionButton").setAttribute("disabled", "true");
    }
  }

  var now = new Date;
  var startTime = now.getTime();

  evolutionAlgorithm(eachGen, message, decryptFunction, fitnessFunction, keylength, populationSize, birthRate, randomPerGeneration, generationLimit);
}

function stopEvolution () {
  evolutionRunning = false;
  document.getElementById("startEvolutionButton").removeAttribute("disabled");
  document.getElementById("stopEvolutionButton").setAttribute("disabled", "true");
}

// Runs on page load
document.addEventListener("DOMContentLoaded", function (event) {
  dataText = [
    ["title", "Toolbox A3: Evolutionary Algorithm"],
    ["subtitle", "Simulates natural selection to solve ciphers"]
  ]

  startTextAnimation(0);
  setupExpandInfo();
})
