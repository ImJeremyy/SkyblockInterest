const fs = require("fs");
const client = require("redis").createClient(process.env.REDIS_URL);

function getIdFromAt(arg) {
	const id = arg.substring(3, arg.length - 1);
	return id;
}

function getAtFromId(id) {
	const at = "<@!" + id + ">";
	return at;
}

function jsonAppend(filePath, key, value) {
	var origData = require(filePath);
	origData[key] = value;
	var jsonData = JSON.stringify(origData);
	fs.writeFileSync(filePath, jsonData);
}

module.exports.getIdFromAt = getIdFromAt;
module.exports.getAtFromId = getAtFromId;
module.exports.jsonAppend = jsonAppend;
