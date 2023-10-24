
const { Client, GatewayIntentBits } = require( 'discord.js' );

const { token } = require( '../config.json' );
const { addMember } = require( './events/addMember' );
const { start } = require( './events/start' );
const bot = new Client( {
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers ],
} );
bot.on( 'ready', start );
bot.on( 'guildMemberAdd', addMember );
module.exports = {
    connect: bot.login( token ).catch( console.trace )
};
