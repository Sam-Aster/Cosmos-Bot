
const { Client, GatewayIntentBits } = require( 'discord.js' );

const { token } = require( '../config.json' );
const { handleError } = require( '../appUtilities/errorHandler.js' );
const { start, addMember } = require( './events' );
const bot = new Client( {
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers ],
} );
bot.on( 'ready', start );
bot.on( 'guildMemberAdd', addMember );
module.exports = {
    connect: bot.login( token ).catch( handleError )
};
