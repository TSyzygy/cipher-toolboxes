function ngramScore (text, n, language = "english", normaliseDiacritics = true, normaliseLigatures = true) {
  var langData, alphabet, text, ngramData, sum;

  langData = languageData[language];
  alphabet = langData["alphabet"]["basic"];
  text = text.toUpperCase().split('').filter(c => alphabet.indexOf(c) > -1).join("");

  ngramData = langData["ngrams"][n];
  sum = 0;
  for (var i = 0; i <= text.length - n; i++) {
    var score = data[text.slice(i, i+n)];
    if (score >= 1) {
      sum += score;
    }
  }
  return sum / (text.length - n);
}

// Returns an object with all of the keys with diacritics removed and their scores added to the equivalent key with removed diacritics
function normaliseDiacritics (n, language) {
  var newKey, char, langData, ngramData, diacritics, newNgramData;
  langData = languageData[language];
  ngramData = langData["ngrams"][n];
  diacritics = langData["alphabet"]["diacritics"];
  newNgramData = {};

  for (key in ngramData) {
    newKey = key;
    for (let i = 0; i < n; i++) {
      char = key[i];
      if (char in diacritics) {
        newKey = newKey.substr(0, i) + diacritics[char] + newKey.substr(i + 1);
      }
    };
    if (newKey in newNgramData) {
      newNgramData[newKey] += ngramData[key];
    } else {
      newNgramData[newKey] = ngramData[key];
    }
  }

  return newNgramData;
}
