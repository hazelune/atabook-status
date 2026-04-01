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
		// and use that array to formulate the parsing; selects only those questions that contain answers to the desired questions
		const messages = $(statusSelectors.join(', '));
		// for each message
		const cheerioOutput = messages.map((i, element) => {
			// get dom of it
			const $element = $(element)
			// this part gets submitter and time
			const $split = $element.find('.split');
			const submitter = $split.children('strong').text();
			const time = $split.children('span').attr("data-time");

			// this part gets the actual questions
			const $statusTextQuestion = $element.find(`.question:contains('${tq}')`);
			const statusText = tq !== "" ? $statusTextQuestion.children('span').text() : "";
			const $statusEmojiQuestion = $element.find(`.question:contains('${eq}')`);
			const statusEmoji = eq !== "" ? $statusEmojiQuestion.children('span').text() : "";
			const message = $element.find(".message-text").text();

			// create return object
			return {
				"submitter": submitter,
				"time": Number(time),
				"statusText": statusText,
				"statusEmoji": statusEmoji,
				"message": message
			};
			// console.log($element.find('question'):contains("change my status:");
		});
		// .sort((a,b) => fn) places a before b if the function return is less than 0 and vice versa if the function return is greater than 0
		const returnArr = cheerioOutput.toArray().sort((a, b) => {
			return b.time - a.time
		}).slice(0, n);
		
		if (returnArr.length === 1) {
			return returnArr[0];
		}
		return returnArr;
	} catch (error) {
		console.error("Error:", error.message);
		
	}
}

console.log(await getAtabookStatus({
	url: 'https://hazelune.atabook.org',
	n: 1,
	eq: 'change my status emoji:',
}));
