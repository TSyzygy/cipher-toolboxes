dataText = [
  ["title", "Toolbox A1: Text Analysis"],
  ["subtitle", "Index of coincidence"], 
  ["subtitle", "Frequency analysis"], 
  ["subtitle", "Ngram analysis"],
  ["subtitle", "And more"]
]

function typeWriter(text, i, id, fnCallback) {
  if (i < (text.length)) {
    document.getElementById(id).innerHTML = text.substring(0, i) + '_';
    setTimeout(function () {
      typeWriter(text, i + 1, id, fnCallback)
    }, 60);
  }
  else if (i = text.length) {
    document.getElementById(id).innerHTML = text.substring(0, i);
    setTimeout(fnCallback, 700);
  }
}

function startTextAnimation(i) {
  // check if dataText[i] exists
  if (i < dataText.length) {
    // text exists! start typewriter animation
    typeWriter(dataText[i][1], 0, dataText[i][0], function(){
      // after callback (and whole text has been animated), start next text
      startTextAnimation(i + 1);
    });
  }
}


// Sets up the expandable info boxes
function setupExpandInfo() {
  var expandTitles = document.getElementsByClassName('expandTitle');
  var expandContents = document.getElementsByClassName('expandContent');

  for (i = 0; i < expandTitles.length; i++) {
    var t = expandTitles[i];
    var c = expandContents[i];
    t.dataset.expandId = i;
    t.addEventListener('click', function () {
      console.log(this.getAttribute('data-expand-id'))
      document.getElementById('ec' + String(this.getAttribute('data-expand-id'))).classList.toggle('hidden');
      this.classList.toggle('hidden');
    });
    t.classList.add("hidden")
    c.setAttribute("id", "ec" + String(i))
    c.classList.add("hidden")
  }
}


// Calculates the IOC and returns result to user
function calculateIOC() {
	var text = document.getElementById("iocMessage").value;
	var alphabet = document.getElementById("iocAlphabet").value;
	var caseSensitive = document.getElementById("iocCaseSensitive").checked;
	document.getElementById("iocResult").innerHTML = Number(Math.round(ioc(text, alphabet, caseSensitive)+'e5')+'e-5');
}

// Does the raw IOC calculation
function ioc(text, alphabet, caseSensitive) {
	if (caseSensitive == false) {
		text = text.toUpperCase();
		alphabet = alphabet.toUpperCase();
	}
	text = text.split('').filter(c => alphabet.indexOf(c) > -1).join("");
	var l = text.length;
	var ioc = 0;
	for (let i = 0; i < alphabet.length; i++) {
		a = [...text].filter(k => k === alphabet[i]).length;
		ioc += (a/l) * ((a-1)/(l-1));
	}
	return (ioc * alphabet.length);
}

// Does the cool forms stuff for the frequency analyser
function updateFreqAlphabet() {
	if (document.getElementById("letters").checked == true) {
		if (document.getElementById("freqCaseSensitive").checked == true) {document.getElementById("freqAlphabet").value = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"} else {document.getElementById("freqAlphabet").value = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"};
		document.getElementById("freqAlphabet").setAttribute("readonly", true);
	} else if (document.getElementById("lettersAndNumbers").checked == true) {
		if (document.getElementById("freqCaseSensitive").checked == true) {document.getElementById("freqAlphabet").value = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"} else {document.getElementById("freqAlphabet").value = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"};
		document.getElementById("freqAlphabet").setAttribute("readonly", true);
	} else if (document.getElementById("allChars").checked == true) {
		var message = document.getElementById("freqMessage").value;
		var newAlphabet = "";
		if (document.getElementById("freqCaseSensitive").checked == false) {
			message = message.toUpperCase()
		};
		for (let i = 0; i < message.length; i++) {
			var char = message[i];
			if (newAlphabet.indexOf(char) < 0) {
				newAlphabet += char;
			};
		};
		document.getElementById("freqAlphabet").value = newAlphabet;
		document.getElementById("freqAlphabet").setAttribute("readonly", true);
	} else {
		document.getElementById("freqAlphabet").removeAttribute("readonly");
	}
}

function updateToAnalyse() {
	if (document.getElementById("chars").checked) {
		document.getElementById("forNGrams").style.display = "none";
	} else {
		document.getElementById("forNGrams").style.display = "block";
	}
}

function resetFreqForm() {
	document.getElementById("forNGrams").style.display = "none"; // Hides the ngrams bit
	document.getElementById("freqResult").innerHTML = ""; // Clears the previous result
	document.getElementById("orderByFreq").classList.remove("invert"); // Resets the byFreq and byChar ordering buttons
	document.getElementById("orderByChar").classList.remove("invert");
	document.getElementById("freqHeadings").classList.add("hidden"); // Hides the frequency analysis headings
}

// Does the raw frequency analysis
function frequencyAnalysis(text, caseSensitive, alphabet, toAnalyse, n, ngramType) {

	result = {}

	n = Number(n)

	// Makes all chars uppercase if not caseSensitive
	if (!caseSensitive) {
		text = text.toUpperCase()
		alphabet = alphabet.toUpperCase()
	}

	// Removes all chars not in alphabet
	text = text.split('').filter(c => alphabet.indexOf(c) > -1).join("")

	if (toAnalyse == "chars") {

		for (i = 0; i < alphabet.length; i++) {
			var char = alphabet[i]
			result[char] = [...text].filter(k => k === char).length;
		}

	} else {
		
		if (ngramType == "blocks") {
			var increment = n;
		} else {
			var increment = 1;
		}

		for (i = 0; i+n < text.length; i += increment) {
			var gram = text.slice(i, i+n);
			if (gram in result) {
				result[gram] += 1;
			} else {
				result[gram] = 1;
			}
		}

	}

	return result
}

function doFreqAnalysis(order, invert) {
	var text = document.getElementById("freqMessage").value;
	var caseSensitive = document.getElementById("freqCaseSensitive").checked;
	var alphabet = document.getElementById("freqAlphabet").value;
	var toAnalyse = document.querySelector('input[name="toAnalyse"]:checked').value;
	var n = document.getElementById("n").value;
	var ngramType = document.querySelector('input[name="ngramType"]:checked').value;

	fillFreqResults(
		frequencyAnalysis(text, caseSensitive, alphabet, toAnalyse, n, ngramType),
		order,
		invert,
		text
	);
}

function fillFreqResults(result, order, invert) {

	function padBefore(text, size) {
		var s = String(text);
		while (s.length < (size || 2)) {s = " " + s;}
		return s;
	} // source: https://gist.github.com/endel/321925f6cafa25bbfbde

	function padAfter(text, size) {
		var s = String(text);
		while (s.length < (size || 2)) {s += " ";}
		return s;
	} // source: https://gist.github.com/endel/321925f6cafa25bbfbde

	var ordered = [];
	for (var key in result) {
		ordered.push([key, result[key]]);
	}

	if (order == "freq") {
		ordered.sort(function(a, b) {
			return b[1] - a[1];
		});
	} else if (order == "char") {
		ordered.sort();
	}

	if (invert) {
		ordered = ordered.reverse()
	}

	var s = String(ordered.length).length; // length of string of number of items in result
	var n = Math.max(Object.keys(ordered));
	var sum = ordered.map(x => x[1]).reduce((a,b) => Number(a) + Number(b), 0)

    document.getElementById("freqHeadings").classList.remove("hidden"); // Ensures headings are shown
	document.getElementById("freqResult").innerHTML = ""; // Clears previous results
	for (i = 0; i < ordered.length; i++) {
		var node = document.createElement("LI"); // Create a <li> node
    var text = padAfter(padBefore(i, s), 7) + padAfter(ordered[i][0], 7) + padAfter(ordered[i][1], 7) + (((ordered[i][1] / sum)*100).toFixed(2)) // The text for line i
		node.appendChild(document.createTextNode(text)); // Append the text to <li>
		document.getElementById("freqResult").appendChild(node); // Append <li> to <ul> with id="freqResult"
	}
}

// runs on page load
document.addEventListener('DOMContentLoaded', function (event) {
  startTextAnimation(0);
  setupExpandInfo();
})
