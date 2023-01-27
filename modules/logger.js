import fs from 'fs';
function log(message) {
	var stream = fs.createWriteStream('log.bin', { flags: 'a' });
	stream.write(message + '\n');
	stream.end();
}
export default log;
