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

function* evolution (message, decryptFunction, scoreFunction, keylength = undefined, populationSize = 20, birthRate = 2, randomPerGeneration = 5, maxGenerations = 200, endOnSaturation = true, generateKey = generateAlphaKey, permuteKey = permuteAlphaKey) {

  // Setup
  var generation = [];
  var key;
  var nextGen;

  function birth (key) {return [key, scoreFunction(decryptFunction(message, key))]};

  for (var i = 0; i < populationSize; i++) {
    generation.push(birth(generateKey(keylength)));
  }

  for (var n = 0; n < maxGenerations; n++) {
    // Adds children
    children = [];
    for (var parent of generation) {
      for (var i = 0; i < birthRate; i++) {
        children.push(birth(permuteKey(parent[0])));
      }
    }
    generation.push(...children);

    // Adds random keys
    random = [];
    for (var i = 0; i < randomPerGeneration; i++) {
      generation.push(birth(generateKey(keylength)));
    }

    // Sorts ascending and removes elements from front
    generation.sort(function(a, b) {return a[1] - b[1]});
    generation.splice(0, generation.length-populationSize);
    // Checks if all keys are same
    if (generation.every((val, i, arr) => val[0] === arr[0][0]) && endOnSaturation) {
      break;
    }
    yield [n, generation];
  }

  return [n, generation];
}

// Function allowing easy use of evolution algorithm - pass it a function to run after each generation followed by the paramaters for the evolution algorithm above
function evolutionAlgorithm(eachGen) {
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
