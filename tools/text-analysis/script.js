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
	text = text.split("").filter(c => alphabet.indexOf(c) > -1).join("")

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
	document.getElementById("freqHeadings").classList.remove("hidden"); // Ensures headings are shown

	var text = document.getElementById("freqMessage").value;
	var caseSensitive = document.getElementById("freqCaseSensitive").checked;
	var alphabet = document.getElementById("freqAlphabet").value;
	var toAnalyse = document.querySelector('input[name="toAnalyse"]:checked').value;
	var n = document.getElementById("n").value;
	var ngramType = document.querySelector('input[name="ngramType"]:checked').value;

	fillResults(
		frequencyAnalysis(text, caseSensitive, alphabet, toAnalyse, n, ngramType),
		order,
		invert,
		"freqResult",
		function (i, d) {
			var sum = d.map(x => x[1]).reduce((a,b) => Number(a) + Number(b), 0);
        	return padAfter(padBefore(i, String(d.length).length), 7) + padAfter(d[i][0], 7) + padAfter(d[i][1], 7) + (((d[i][1] / sum)*100).toFixed(2))
        }
	);
}

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

function fillResults(result, order, invert, location, lineText) {

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

	// var n = Math.max(Object.keys(ordered));

	document.getElementById(location).innerHTML = ""; // Clears previous results
	for (i = 0; i < ordered.length; i++) {
		var node = document.createElement("LI"); // Create a <li> node
		var text = lineText(i, ordered) // The text for line i
		node.appendChild(document.createTextNode(text)); // Append the text to <li>
		document.getElementById(location).appendChild(node); // Append <li> to <ul> with id="freqResult"
	}
}

function orderEnglishFreq(order, invert) {
	englishFreq = {
"E": "11.2",
"T": "9.36",
"A": "8.50",
"R": "7.59",
"I": "7.55",
"O": "7.51",
"N": "6.75",
"S": "6.33",
"H": "6.09",
"D": "4.25",
"L": "4.03",
"U": "2.76",
"W": "2.56",
"M": "2.41",
"F": "2.23",
"C": "2.20",
"G": "2.02",
"Y": "1.99",
"P": "1.93",
"B": "1.49",
"K": "1.29",
"V": "0.978",
"J": "0.153",
"X": "0.150",
"Q": "0.095",
"Z": "0.077",
	}
	fillResults(englishFreq, order, invert, "englishFreq", function (i, d) {return padAfter(padBefore(i, String(d.length).length), 7) + padAfter(d[i][0], 7) + d[i][1]})
}

// Runs on page load
document.addEventListener("DOMContentLoaded", function (event) {
  dataText = [
    ["title", "Toolbox A1: Text Analysis"],
    ["subtitle", "Index of coincidence"],
    ["subtitle", "Frequency analysis"],
    ["subtitle", "Ngram analysis"],
    ["subtitle", "And more"]
  ]

  startTextAnimation(0);
  setupExpandInfo();
})
