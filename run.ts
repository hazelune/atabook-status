import Conf from 'conf';
import { statusChange } from './discord_api_req.mts';
import type { StatusChangeArgs } from './interfaces.mts';

const config = new Conf({ projectName: 'atabook-discord-status' });

const statusChangeInfo: StatusChangeArgs = {
	discordToken: config.get("discordAuthToken"),
	atabookUrl: config.get("ataUrl"),
	textQuestion: config.get("statusTextQuestion"),
	emojiQuestion: config.get("statusEmojiQuestion") 
};

await statusChange(statusChangeInfo);
