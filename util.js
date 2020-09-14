const fs = require("fs");

function getIdFromAt(arg) {
	const id = arg.substring(3, arg.length - 1);
	return id;
}

function getAtFromId(id) {
	const at = "<@!" + id + ">";
	return at;
}
module.exports.getIdFromAt = getIdFromAt;
module.exports.getAtFromId = getAtFromId;
