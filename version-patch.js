const { writeFile } = require('fs')
const { promisify } = require('util')

const write = promisify(writeFile)

if (process.argv[2]) {
	(async () => {
		try {
			const package = require('./package.json')
			package.version = `${package.version}-${process.argv[2]}`
			await write('package.json', JSON.stringify(package, null, '\t'), 'utf8')
		} catch (e) {
			console.error(e)
			process.exit(1)
		}
	})()
}
