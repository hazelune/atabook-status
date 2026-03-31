import * as cheerio from 'cheerio';

// read from url and get full dom

interface AtabookParameters {
	url: string;
	n: number;
	tq?: string;
	eq?: string;
}

export async function getAtabookStatus({url, n, tq = "", eq = ""}: AtabookParameters) {
	// in case people forget the https:// that cheerio needs
	if (!url.startsWith('https://')) {
		url = 'https://' + url;
	}
	try {
		// output string describing process and throw error if no questions given
		if (tq !== "" && eq !== "") {
			console.log(`Fetching ${n} emoji and text submissions from ${url} for answers to "${eq}" and "${tq}", respectively.`);
		} else if (tq === "" && eq !== "") {
			console.log(`Fetching ${n} emoji submissions from ${url} for answers to "${eq}".`);
		} else if (tq !== "" && eq === "") {
			console.log(`Fetching ${n} text submissions from ${url} for answers to "${tq}".`);
		} else {
			throw new Error("No status-related questions given.")
		}
		// error automatically thrown if this fails
		const $ = await cheerio.fromURL(url);
		// build array based on questions given
		const statusSelectors: string[] = [];
		if (tq !== "") {
			statusSelectors.push(`.message:contains('${tq}')`);
		}
		if (eq !== "") {
			statusSelectors.push(`.message:contains('${eq}')`);
		}
		// and use that array to formulate the parsing
		const messages = $(statusSelectors.join(', '));
		// for each message
		const cheerioOutput = messages.map((i, element) => {
			// get dom of it
			const $element = $(element)
			const $split = $element.find('.split');
			const submitter = $split.children('strong').text();
			const time = $split.children('span').attr("data-time");
			const $statusTextQuestion = $element.find(`.question:contains('${tq}')`);
			const statusText = tq !== "" ? $statusTextQuestion.children('span').text() : "";
			const $statusEmojiQuestion = $element.find(`.question:contains('${eq}')`);
			const statusEmoji = eq !== "" ? $statusEmojiQuestion.children('span').text() : "";
			const message = $element.find(".message-text").text();
			return {
				"submitter": submitter,
				"time": Number(time),
				"statusText": statusText,
				"statusEmoji": statusEmoji,
				"message": message
			};
			// console.log($element.find('question'):contains("change my status:");
		});

		const returnArr = cheerioOutput.toArray();
		
		if (returnArr.length == 1) {
			return returnArr[0];
		}
		return returnArr;
	} catch (error) {
		console.error("Error:", error.message);
		
	}
}

console.log(await getAtabookStatus({
	url: 'https://hazelune.atabook.org',
	n: 2,
	tq: 'change my status text:',
}));
