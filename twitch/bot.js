const tmi = require( 'tmi.js' );
const { channel, clientPassword } = require( '../config.json' );
const { connected } = require( './events/connected' );
const bot = new tmi.client( {
    identity: {
        username: channel,
        password: clientPassword
    },
    channels: [
        'sam_aster_'
    ]
} );
exports.bot = bot;
bot.on( 'connected', connected );
module.exports = {
    connect: bot.connect().catch( console.trace )
};
