const CommandBase = require("./command_base");
const client = require("redis").createClient(process.env.REDIS_URL);

class SetCommand extends CommandBase {
	constructor() {
		super(["set"]);
	}

	run(message, args) {
		const key = args[0];
		const value = args[1];
		const channel = message.channel;
		const user = message.author;

		client.set(key, value);
		channel.send(user.toString() + "Set Key-Value pair: Key: " + key + " Value: " + value);
	}
}

module.exports = SetCommand;
