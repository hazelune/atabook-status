import { isCancel, cancel, confirm, select, text } from '@clack/prompts';
import Conf from 'conf';
import type { StatusChangeArgs } from './interfaces.mts';

const config = new Conf({ projectName: 'atabook-discord-status' });

let discordTokenInput = config.get("discordAuthToken");
let urlInput = config.get("ataUrl");
let textQuestionInput = config.get("statusTextQuestion");
let emojiQuestionInput = config.get("emojiTextQuestion");

while (true) {
	const updateChoice = await select({
		message: 'What would you like to update? Exit with Ctrl+C',
		options: [
			{ value: 'url', label: 'Atabook URL' },
			{ value: 'text', label: 'Text question' },
			{ value: 'emoji', label: 'Emoji question' },
			{ value: 'auth', label: 'Discord auth token' },
		]
	})
	if (isCancel(updateChoice)) {
		cancel('Ending setup');
		process.exit(0);
	} else if (updateChoice === 'url') {
		urlInput = await text({
			message: 'Input the link to your Atabook page:',
			validate(value) {
				if (!value.endsWith('.atabook.org')) return `Not a valid link.`
			},
		});
		config.set('ataUrl', urlInput);
	} else if (updateChoice === 'text') {
		textQuestionInput = "";
		const textChange = await confirm({
			message: "Would you like others to be able to change your status's text?"
		});

		if (textChange) {
			textQuestionInput = await text({
				message: "Input the question of your Atabook that should alter your status's text:"
			});
		}
		config.set('statusTextQuestion', textQuestionInput);
	} else if (updateChoice === 'emoji') {
		emojiQuestionInput = "";
		const emojiChange = await confirm({
			message: "Would you like others to be able to change your status's emoji?"
		});

		if (emojiChange) {
			emojiQuestionInput = await text({
				message: "Input the question of your Atabook that should alter your status's emoji:"
			});
		}
		config.set('statusEmojiQuestion', emojiQuestionInput);
	} else if (updateChoice === 'auth') {
		discordTokenInput = await text({
			message: 'Input your Discord authentification token:',
		});
		config.set('discordAuthToken', discordTokenInput);
	}
}
