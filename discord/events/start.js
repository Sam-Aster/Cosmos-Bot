const { PermissionFlagsBits, Client } = require( 'discord.js' );
const { validateServers } = require( './eventFunctions/validateServers.js' );
const servers = require( '../servers.json' );
const { setServers } = require( './eventFunctions/setServers.js' );

/**
 *
 * @param {Client<true>} client
 */
const start = async ( client ) =>
{
    const guilds = client.guilds;
    let fetchedGuilds = await guilds.fetch().catch( console.trace );
    if ( typeof fetchedGuilds === 'undefined' )
    {
        return;
    }
    validateServers( fetchedGuilds );
    for ( const server of servers )
    {
        if ( !guilds.cache.find( ( guild ) =>
        {
            return guild.name === server.name;
        } ) )
        {
            const guild = await guilds.create( {
                name: server.name,
                icon: server.icon,
                verificationLevel: server.verificationLevel,
                defaultMessageNotifications: server.defaultMessageNotifications,
                explicitContentFilter: server.explicitContentFilter,
                roles: server.roles,
                channels: server.channels
            } ).catch( console.trace );
            if ( typeof guild === 'undefined' )
            {
                return;
            }
            await guild.roles.everyone.setPermissions( [ PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessagesInThreads ] ).catch( console.trace );
        }
    };
    fetchedGuilds = await guilds.fetch().catch( console.trace );
    if ( typeof fetchedGuilds === 'undefined' )
    {
        return;
    }
    setServers( fetchedGuilds );
};
exports.start = start;
