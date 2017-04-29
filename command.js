class Command {
	constructor(name, execute, desc, servers = []) {
		this.name = name;
		this.execute = execute;
		this.desc = desc;
		this.servers = servers;
	}
}
module.exports = Command;
