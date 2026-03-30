import dotenv from 'dotenv';
import { getAtabookStatus } from './atabook-scraper.mts';
import { getDiscordJson } from '../../neocities/src/js/discord_api.mts';

dotenv.config();

function randomDelay(s: number) {
	const time = s + (Math.random() * 20);
	console.log(time);
	return new Promise(resolve => setTimeout(resolve, time*1000));
}

const TOKEN = process.env.TOKEN;

export async function statusChange(discordId: string, atabookUrl: string, textQuestion: string, statusQuestion: string) {
	const USER_URL = "https://discord.com/api/v10/users/@me/settings"

	while (true) {
		console.log("loop");
		const statusJson = await getAtabookStatus(atabookUrl, textQuestion, statusQuestion, 1);
		const discordJson = await getDiscordJson(discordId);
		const newStatus = statusJson.statusText;
		const currentStatus = discordJson.statusText;
		const newEmoji = statusJson.statusEmoji;
		const currentEmoji = discordJson.statusEmoji;
		if (newStatus != currentStatus) {
			console.log(`updating status to ${newEmoji} ${newStatus}`);
			const payload = JSON.stringify({
				"custom_status": {
					"text": newStatus,
					"emoji_name": newEmoji
				}
			});


			fetch(USER_URL, {
				method: 'PATCH',
				headers: {
					'Authorization': TOKEN,
					'Content-Type': 'application/json',
					'Host': 'discord.com',
					'Origin': 'https://discord.com',
					'Referer': 'https://discord.com',
					'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv146.0) Gecko/20100101 Firefox/146.0',
				},
				body: payload,
			});
		}
		else {
			console.log("no status updates");
		}
		await randomDelay(20);
	}
}
statusChange("486280933058805793", 'https://hazelune.atabook.org', 'change my status text:', 'change my status emoji:');
