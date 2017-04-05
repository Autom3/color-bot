class Command {
	constructor(name, execute, desc) {
		this.name = name;
		this.execute = execute;
		this.desc = desc;
	}
}
module.exports = Command;
