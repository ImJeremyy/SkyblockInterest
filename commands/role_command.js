const CommandBase = require("./command_base");
const client = require("redis").createClient(process.env.REDIS_URL);

class RoleCommand extends CommandBase {
	constructor() {
		super(["role"]);
	}

	run(message, args) {
		const channel = message.channel;
		const user = message.author;

		client.get("interestRoleId", (err1, reply1) => {
			if (err1 == null) {
				const roleId = reply1.toString();
				message.guild.roles
					.fetch(roleId)
					.then((role) => {
						const member = message.member;
						console.log(member.roles.cache);
						if (member.roles.cache.has(roleId)) {
							member.roles.remove(role);
							channel.send(user.toString() + " We took the notification role from you. Do **.role** again to get the role back.");
						} else {
							member.roles.add(role);
							channel.send(user.toString() + " You have been given the notification role. Do **.role** again to remove the role.");
						}
					})
					.catch((err) => {
						console.log(err);
						channel.send(user.toString() + " Invalid role id! Tell an admin to do .setinterest role <@role>.");
					});
			} else {
				channel.send(user.toString() + " No role was set.. Tell an admin to do .setinterest role <@role>");
			}
		});
	}
}

module.exports = RoleCommand;
