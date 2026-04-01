import dotenv from 'dotenv';
import { isEqual } from 'lodash-es';
import { getAtabookStatus } from './atabook-scraper.mts';

function randomDelay(s: number) {
	const time = s + (Math.random() * 20);
	console.log(time);
	return new Promise(resolve => setTimeout(resolve, time*1000));
}

dotenv.config();

const TOKEN = process.env.TOKEN;
const USER_URL = "https://discord.com/api/v10/users/@me/settings"

interface StatusChangeArguments {
	discordToken: string,
	atabookUrl: string,
	textQuestion?: string,
	emojiQuestion?: string
}

export async function statusChange({discordToken, atabookUrl, textQuestion = "", emojiQuestion = ""}: StatusChangeArguments) {
	// save the original most recent message and catch deviations from it
	let oldStatusJson = await getAtabookStatus({
		url: atabookUrl,
		n: 1,
		tq: textQuestion,
		eq: emojiQuestion
	});
	while (true) {
		console.log("loop");
		const newStatusJson = await getAtabookStatus({
			url: atabookUrl,
			n: 1,
			tq: textQuestion,
			eq: emojiQuestion
		});
		if (!isEqual(newStatusJson, oldStatusJson)) {
			console.log('these are diff');
			// deep copies to update what the previous newest message is
			oldStatusJson = JSON.parse(JSON.stringify(newStatusJson));
			const payloadJson = {
				"custom_status": {
				}
			}
			if (newStatusJson.statusText !== "") {
				payloadJson.custom_status.text = newStatusJson.statusText;
			}
			if (newStatusJson.statusEmoji !== "") {
				payloadJson.custom_status.emoji_name = newStatusJson.statusEmoji;
			}
			const payloadStr = JSON.stringify(payloadJson);
			fetch(USER_URL, {
				method: 'PATCH',
				headers: {
					'Authorization': discordToken,
					'Content-Type': 'application/json',
					'Host': 'discord.com',
					'Origin': 'https://discord.com',
					'Referer': 'https://discord.com',
					'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv146.0) Gecko/20100101 Firefox/146.0',
				},
				body: payloadStr,
			});
		}
		else {
			console.log("no status updates");
		}
		await randomDelay(20);
	}
}
