const { PermissionFlagsBits, GuildMember, Client, ChannelType, ThreadAutoArchiveDuration } = require( 'discord.js' );
const { handleError } = require( '../appUtilities/errorHandler.js' );
const { validateServers } = require( './discordFunctions/validateServers.js' );
const servers = require( './servers.json' );
const { setServers } = require( './discordFunctions/setServers.js' );

/**
 *
 * @param {Client<true>} client
 */
const start = async ( client ) =>
{
    const guilds = client.guilds;
    guilds.fetch().then( validateServers );
    for ( const server of servers )
    {
        if ( !guilds.cache.find( ( guild ) =>
        {
            return guild.name === server.name;
        } ) )
        {
            await guilds.create( {
                name: server.name,
                icon: server.icon,
                verificationLevel: server.verificationLevel,
                defaultMessageNotifications: server.defaultMessageNotifications,
                explicitContentFilter: server.explicitContentFilter,
                roles: server.roles,
                channels: server.channels
            } ).then( ( guild ) =>
            {
                guild.roles.everyone.setPermissions( [ PermissionFlagsBits.ReadMessageHistory ] );
            }, handleError );
        }
    };
    guilds.fetch().then( setServers, handleError );
};
exports.start = start;

/**
 *
 * @param {GuildMember} newMember
 */
const addMember = async ( newMember ) =>
{
    if ( newMember.guild.name.startsWith( 'Mirus Verification v' ) )
    {
        const server = newMember.guild;
        server.channels.fetch().then( ( channels ) =>
        {
            const welcomeChannel = channels.find( ( channel ) =>
            {
                return channel?.name === 'welcome';
            } );
            if ( typeof welcomeChannel !== 'undefined' && welcomeChannel?.type === ChannelType.GuildText )
            {
                welcomeChannel.threads.create( {
                    name: `Hello, ${ newMember.displayName }, and welcome to Mirus!`,
                    type: ChannelType.PrivateThread,
                    autoArchiveDuration: ThreadAutoArchiveDuration.OneHour
                } ).then( ( thread ) =>
                {

                } );
            }
        }, handleError );
    }
};
exports.addMember = addMember;
