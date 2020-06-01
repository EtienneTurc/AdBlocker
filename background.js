
let domains = [];
let urls = [];
let urls_to_block = []

blockedRequestsCount = 0
function block() {
	blockedRequestsCount += 1
	chrome.browserAction.setBadgeText({ text: blockedRequestsCount.toString() })
	return { cancel: true }
}



async function getDomains() {
	await fetch("https://raw.githubusercontent.com/EnergizedProtection/block/master/spark/formats/domains.txt")
		.then(response => response.text())
		.then(responseText => {
			let dom = responseText.split("\n").filter(d => !d.startsWith("#"))
			domains = dom.map(d => "*://" + d + "/*")
			// chrome.webRequest.onBeforeRequest.addListener(
			// 	block,
			// 	{ urls: urls },
			// 	["blocking"]
			// );

		})

	await fetch("https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_general_block.txt")
		.then(response => response.text())
		.then(responseText => {
			let dom = responseText.split("\n").filter(d => !d.startsWith("#") && d != "")
			urls = dom.map(d => "*://*/*" + d + "*")
		})

	urls_to_block = domains.concat(urls)

	chrome.webRequest.onBeforeRequest.addListener(
		block,
		{ urls: urls_to_block },
		["blocking"]
	);

}

getDomains()

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		console.log(request.toggleAdBlocking)
		if (request.toggleAdBlocking == false) {
			chrome.webRequest.onBeforeRequest.removeListener(block)
			sendResponse({ done: "done" });
		}
		else if (request.toggleAdBlocking) {
			chrome.webRequest.onBeforeRequest.addListener(
				block,
				{ urls: urls_to_block },
				["blocking"]
			);
			sendResponse({ done: "done" });
		}
	});
