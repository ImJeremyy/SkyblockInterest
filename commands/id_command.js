const CommandBase = require("./command_base");

const client = require("redis").createClient(process.env.REDIS_URL);

class IdCommand extends CommandBase {
	constructor() {
		super(["id"]);
	}

	run(message, args) {
		const channel = message.channel;
		const user = message.author;
		channel.send(user.toString() + " Channel ID: + " + channel.id + " User Discord ID: " + user.id);
		console.log(user.roles);
	}
}

module.exports = IdCommand;
