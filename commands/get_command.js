const CommandBase = require("./command_base");

const client = require("redis").createClient(process.env.REDIS_URL);

class GetCommand extends CommandBase {
	constructor() {
		super(["get"]);
	}

	run(message, args) {
		const channel = message.channel;
		const user = message.author;

		client.get(args[0], (err, reply) => {
			if (err != null) {
				channel.send(user.toString() + " Successful: " + reply.toString());
			} else {
				channel.send(user.toString() + " Error: " + err);
			}
		});
	}
}
module.exports = GetCommand;
