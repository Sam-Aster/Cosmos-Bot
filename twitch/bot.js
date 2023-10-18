const tmi = require( 'tmi.js' );
const { channel, clientPassword } = require( '../config.json' );
const { handleError } = require( '../appUtilities/errorHandler.js' );
const bot = new tmi.client( {
    identity: {
        username: channel,
        password: clientPassword
    },
    channels: [
        'sam_aster_'
    ]
} );
bot.on( 'connected', () =>
{
    bot.say( channel, 'Hello!' );
} );
module.exports = {
    connect: bot.connect().catch( handleError )
};
