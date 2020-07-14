var cipherSpecificFunctions = { // decrypt, generateKey, permuteKey
  "vigenere":
    [
      vigenereCrypt,
      generateAlphaKey,
      permuteAlphaKey
    ],
  "transposition":
    [
      transpositionCrypt,
      generateOrderKey,
      permuteOrderKey
    ]
};

var scoreFunctions = {
  "quadgrams": quadgramScore,
  "letters": letterScore
};

function randRange(min, max) { // largest number that can be returned is max-1
    return Math.floor(Math.random() * (max - min)) + min
};

// Key functions

function generateAlphaKey (keylength) {
  var key = "";
  for (i = 0; i < keylength; i++) {
    key += alphabet[randRange(0, 26)]
  };
  return key;
}

function permuteAlphaKey (key) {
  var toReplace = randRange(0, key.length);
  var replaceWith = randRange(0, 26);
  key = key.split("")
  key[toReplace] = alphabet[replaceWith];
  return key.join("");
}

function generateOrderKey (keylength) {
  function shuffle (a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }
  var items = [];
  for (i = 0; i < keylength; i++) {
    items.push(i);
  }
  return shuffle(items);
}

function permuteOrderKey (key) {
  var operations, operationWeights, i, f, n, repeat, operation;
  var newKey = [...key];

  // Swaps two randomly chosen positions within the key
  function swap (key) {
    var posB, temp;
    var keylength = key.length;
    var posA = randRange(0, keylength);
    do {
      posB = randRange(0, keylength);
    } while (posA == posB);
    temp = key[posA];
    key[posA] = key[posB];
    key[posB] = temp;
    return key;
  }

  // Shifts some positions from the front to the back of the list
  function flip (key) {
    var keylength = key.length;
    var posA = randRange(1, keylength);
    return key.slice(posA, keylength).concat(key.slice(0, posA));
  }

  // Shifts a block some distance to the right
  function shift (key) {
    var keylength = key.length;
    var blockStart, blockEnd, distance, moveTo;
    var blockLength = randRange(1, keylength - 1); // 9
    blockStart = randRange(0, keylength - blockLength); // 0
    blockEnd = blockStart + blockLength;
    distance = randRange(1, keylength - blockLength - blockStart + 1); // 1
    moveTo = blockEnd + distance;
    return [...key.slice(0, blockStart), ...key.slice(blockEnd, moveTo), ...key.slice(blockStart, blockEnd), ...key.slice(moveTo, keylength)];
  }

  operations = [ // The different operations
    swap,
    flip,
    shift
  ];
  operationWeights = [ // The different combinations of the operations; each 'column' below is equally weighted
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3],
    [1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 0, 0]
  ];

  i = randRange(0, operationWeights[0].length);

  for (f = 0; f < operations.length; f++) {
    repeat = operationWeights[f][i];
    operation = operations[f];
    for (n = 0; n < repeat; n++) {
      newKey = operation([...newKey]);
    }
  }

  return newKey;
};


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

  // Validates cipher choice and sets cipher specific functions
  var cipher = form.elements["cipher"].value;
  if (cipher == "") {
    validated = false;
    document.getElementById("cipherRadio").classList.add("invalid");
  } else {
    var cipherSpecific = cipherSpecificFunctions[cipher];
    document.getElementById("cipherRadio").classList.remove("invalid");
  }

  var keylength = form["keylength"].value;

  // Sets score/fitness function
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
      var timePassed = (now.getTime() - startTime);
      document.getElementById("timePassed").innerHTML = timePassed + "ms";
      var location = document.getElementById("evolutionResult")
      location.innerHTML = ""; // Clears previous results
      var keysFound = results["value"][1].reverse().slice(0, 10);

      var bestKey = keysFound[0][1];
      // Works out if a better key has been found this generation
      // betterKeyFound is always true in first generation
      var betterKeyFound = !genNum;
      if (genNum) {
        if (typeof(bestKey) == "string") {
          var betterKeyFound = !(bestKey == bestKeyInfo[0])
        } else {
          var prev = bestKeyInfo[0];
          for (i = 0; i < bestKey.length; i++) {
            if (bestKey[i] != prev[i]) {
              betterKeyFound = true;
              break;
            }
          }
        }
      }
      if (betterKeyFound) {
        bestKeyInfo = [bestKey, genNum, timePassed];
        document.getElementById("bestDecryption").innerHTML = cipherSpecific[0](message, bestKey);
        document.getElementById("bestKey").innerHTML = bestKeyInfo[0];
        document.getElementById("bestKeyGenFound").innerHTML = bestKeyInfo[1];
        document.getElementById("bestKeyTimeFound").innerHTML = bestKeyInfo[2] + "ms";
      }

      // Updates saturation status
      var worstKey = keysFound[keysFound.length - 1][1];
      if (typeof(bestKey) == "string") {
         var saturated = (bestKey == worstKey)
      } else {
        saturated = true;
        for (i = 0; i < bestKey.length; i++) {
          if (bestKey[i] != worstKey[i]) {
            saturated = false;
            break;
          }
        }
      }

      if (saturated) {
        document.getElementById("saturationStatus").innerHTML = "Y";
      } else {
        document.getElementById("saturationStatus").innerHTML = "N";
      };

      for (var result of keysFound) {
        var key = result[1];
        var node = document.createElement("LI"); // Create a <li> node
        node.appendChild(document.createTextNode(key + ": " + padAfter(Math.round(result[0]), 8))); // Append the text to <li>
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

  var bestKeyInfo = []; // Key, generation found, time found

  evolutionAlgorithm(eachGen, message, ...cipherSpecific, fitnessFunction, keylength, populationSize, birthRate, randomPerGeneration, generationLimit);
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
