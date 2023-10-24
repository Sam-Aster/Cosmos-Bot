const { channel } = require( '../../config.json' );
const { bot } = require( '../bot' );

const connected = () =>
{
    bot.say( channel, 'Hello!' );
};
exports.connected = connected;
