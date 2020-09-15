const CommandBase = require("./command_base");
const client = require("redis").createClient(process.env.REDIS_URL);

class InterestCommand extends CommandBase {
	constructor() {
		super(["interest"]);
	}

	run(message, args) {
		client.get("hoursLeft", (err1, reply1) => {
			client.get("minutesLeft", (err2, reply2) => {
				const user = message.user;
				const channel = message.channel;
				const hoursLeft = reply1.toString();
				const minutesLeft = reply2.toString();
				if (err1 == null && err2 == null) {
					const embed = {
						title: "Skyblock Interest",
						description: "Is in " + hoursLeft + " hours and " + minutesLeft + " minutes",
						color: 25578,
						timestamp: new Date().toString(),
					};
					channel.send(user.toString(), { embed });
				} else {
					channel.send(user.toString() + " An error occurred.");
				}
			});
		});
	}
}

module.exports = InterestCommand;
