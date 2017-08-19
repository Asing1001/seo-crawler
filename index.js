const { start } = require('./crawler');

async function run() {
    await start({url:'https://www.188bet.com/en-gb'});
}

run().catch(console.error.bind(console))