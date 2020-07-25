const languageData = {
  english: {
    alphabet: {
      basic: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      diacritics: {},
      ligatures: {},
    },
    ioc: 1.73,
    ngrams: {
      // Ngram data goes here from english/[n]grams.js files
    }
  },
  french: {
    alphabet: {
      basic: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      diacritics: {
        "À": "A",
        "Â": "A",
        "Æ": "A",
        "Ç": "C",
        "É": "E",
        "È": "E",
        "Ê": "E",
        "Ë": "E",
        "Î": "Ï",
        "Ô": "O",
        "Œ": "O",
        "Ù": "U",
        "Û": "U",
        "Ü": "U",
        "Ÿ": "Y"
        /*
        "A": ["À", "Â"],
        "C": ["Ç"],
        "E": ["É", "È", "Ê", "Ë"],
        "I": ["Î", "Ï"],
        "O": ["Ô"],
        "U": ["Ù", "Û", "Ü"],
        "Y": ["Ÿ"],
        */
      } /* ,
      ligatures: {
        "AE": "Æ",
        "OE": "Œ",
      } */
    },
    ioc: 2.02,
    ngrams: {
      // Ngram data goes here from french/[n]grams.js files
    }
  },
  german: {
    alphabet: {
      basic: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      diacritics: {
        "Ä": "A",
        "Ö": "O",
        "Ü": "U",
        "ß": "S",
      }
    },
    ioc: 2.05,
    ngrams: {
      // Ngram data goes here from german/[n]grams.js files
    }
  },
  italian: {
    ioc: 1.94
  },
  portuguese: {
    ioc: 1.94
  },
  russian: {
    ioc: 1.76
  },
  spanish: {
    ioc: 1.94
  }
};

// ioc data from Wikipedia
