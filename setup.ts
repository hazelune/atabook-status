import { isCancel, cancel, confirm, outro, text } from '@clack/prompts';
import Conf from 'conf';
import type { StatusChangeArgs } from './interfaces.mts';

const config = new Conf({ projectName: 'atabook-discord-status' });

const urlInput = await text({
	message: 'Input the link to your Atabook page:',
	validate(value) {
		if (!value.endsWith('.atabook.org')) return `Not a valid link.`
	},
});
let textQuestionInput = "";
let emojiQuestionInput = "";

const textChange = await confirm({
	message: "Would you like others to be able to change your status's text?"
});

if (textChange) {
	textQuestionInput = await text({
		message: "Input the question of your Atabook that should alter your status's text:"
	});
}

const emojiChange = await confirm({
	message: "Would you like others to be able to change your status's emoji?"
});

if (emojiChange) {
	emojiQuestionInput = await text({
		message: "Input the question of your Atabook that should alter your status's emoji:"
	});
}

if (!textChange && !emojiChange) {
	cancel('Then why are you using this?');
	process.exit(0);
}

const discordTokenInput = await text({
	message: 'Input your Discord authentification token:',
});

config.set('ataUrl', urlInput);
config.set('statusTextQuestion', textQuestionInput);
config.set('statusEmojiQuestion', emojiQuestionInput);
config.set('discordAuthToken', discordTokenInput);

outro('Finished setup');

