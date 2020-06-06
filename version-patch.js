const { writeFile } = require('fs')
const { promisify } = require('util')

const write = promisify(writeFile)

if (process.argv[2]) {
	(async () => {
		try {
			const package = require('./package.json')
			package.version = `${package.version}-${process.argv[2].substring(0, 7)}`
			await write('package.json', JSON.stringify(package, null, '\t'), 'utf8')
			console.log(`version patched to ${package.version}.`)
		} catch (e) {
			console.error(e)
			process.exit(1)
		}
	})()
} else {
	console.log('node version-patch.json [suffix]')
}
