// Text animation on page load
document.addEventListener('DOMContentLoaded', function (event) {

	dataText = [
		["title", "CIPHER TOOLBOXES"],
		["subtitle", "Created by @ThomasS1"], 
		["subtitle", "Cryptography tools"], 
		["subtitle", "Cipher decrypters"], 
		["subtitle", "And lots of other cool projects!"], 
		["subtitle", "Created by @ThomasS1"]
  ]

	function typeWriter(text, i, id, fnCallback) {
		if (i < (text.length)) {
			document.getElementById(id).innerHTML = text.substring(0, i) + '_' + '<span aria-hidden="true"></span>';
			setTimeout(function () {
				typeWriter(text, i + 1, id, fnCallback)
			}, 60);
		}
		else if (i = text.length) {
			document.getElementById(id).innerHTML = text.substring(0, i) + '<span aria-hidden="true"></span>';
			setTimeout(fnCallback, 700);
		}
	}

	function StartTextAnimation(i) {
		// check if dataText[i] exists
		if (i < dataText.length) {
			// text exists! start typewriter animation
			typeWriter(dataText[i][1], 0, dataText[i][0], function(){
				// after callback (and whole text has been animated), start next text
				StartTextAnimation(i + 1);
			});
		}
	}

  StartTextAnimation(0)

})
