const CommandBase = require("./command_base");

class IdCommand extends CommandBase {
	constructor() {
		super(["id"]);
	}

	run(message, args) {
		const channel = message.channel;
		const user = message.author;

		channel.send(user.toString() + " Channel ID: + " + channel.id + " User Discord ID: " + user.id);
	}
}

module.exports = IdCommand;
