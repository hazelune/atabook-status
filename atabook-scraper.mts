import * as cheerio from 'cheerio';

// read from url and get full dom

export async function getAtabookStatus(url: string, tq: string, eq: string, n: number) {
	console.log(`fetching ${n} messages from ${url}`);
	const $ = await cheerio.fromURL(url);
	// select message divs that contain an answer to thatt question
	const messages = $(".message:contains('change my status text:')").slice(0, n);
	// for each message
	const cheerioOutput = messages.map((i, element) => {
		// get dom of it
		const $element = $(element)
		const $split = $element.find('.split');
		const submitter = $split.children('strong').text();
		const time = $split.children('span').attr("data-time");
		const $statusTextQuestion = $element.find(`.question:contains('${tq}')`);
		const statusText = $statusTextQuestion.children('span').text();
		const $statusEmojiQuestion = $element.find(`.question:contains('${eq}')`);
		const statusEmoji = $statusEmojiQuestion.children('span').text();
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
}

console.log(await getAtabookStatus('https://hazelune.atabook.org', 'change my status text:', 'change my status emoji:', 1));
