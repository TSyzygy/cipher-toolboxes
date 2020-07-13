var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var evolutionRunning = false;

function randRange(min, max) { // largest number that can be returned is max-1
    return Math.floor(Math.random() * (max - min)) + min
}

function generateAlphaKey (keylength) {
  var key = "";
  for (i = 0; i < keylength; i++) {
    key += alphabet[randRange(0, 26)]
  }
  return key;
}

function permuteAlphaKey (key, permuteFactor) {
  var toReplace = randRange(0, key.length);
  var replaceWith = randRange(0, 26);
  key = key.split("")
  key[toReplace] = alphabet[replaceWith];
  return key.join("");
}

function* evolution (message, decryptFunction, scoreFunction, keylength = undefined, populationSize = 20, birthRate = 2, randomPerGeneration = 5, maxGenerations = 200, generateKey = generateAlphaKey, permuteKey = permuteAlphaKey) {

  // Setup
  var generation = [];
  var key;
  var nextGen;

  console.log(decryptFunction);

  function birth (key) {return [scoreFunction(decryptFunction(message, key)), key]};

  for (var i = 0; i < populationSize; i++) {
    generation.push(birth(generateKey(keylength)));
  }

  for (var n = 0; n < maxGenerations; n++) {
    // Adds children
    children = [];
    for (var parent of generation) {
      for (var i = 0; i < birthRate; i++) {
        children.push(birth(permuteKey(parent[1])));
      }
    }
    generation.push(...children);

    // Adds random keys
    random = [];
    for (var i = 0; i < randomPerGeneration; i++) {
      generation.push(birth(generateKey(keylength)));
    }

    // Sorts ascending and removes elements from front
    generation.sort(function(a, b) {return a[0] - b[0]});
    generation.splice(0, generation.length-populationSize);
    yield [n, generation];
  }

  return [n, generation];
}

// Function allowing easy use of evolution algorithm - pass it a function to run after each generation followed by the parameters for the evolution algorithm above
function evolutionAlgorithm(eachGen) {
  evolutionRunning = true;
  var result;
  var p = evolution(...Array.prototype.slice.call(arguments, 1));
  function nextGen () {
    result = p.next();
    window.requestAnimationFrame( () => {
      eachGen(result);
      if (!result['done']) {
        if (evolutionRunning) {
          nextGen();
        }
      } else {
        evolutionRunning = false;
      }
    } )
  };
  nextGen();
}
