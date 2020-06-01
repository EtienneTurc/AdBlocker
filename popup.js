let isAdBlockingActive = true

function callBackground() {
	isAdBlockingActive = !isAdBlockingActive
	chrome.runtime.sendMessage({ toggleAdBlocking: isAdBlockingActive }, function (response) {
		console.log(response.done);
	});
}


document.getElementById("button").addEventListener("click", callBackground);
