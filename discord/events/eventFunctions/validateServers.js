const { Collection, OAuth2Guild, Guild } = require( 'discord.js' );
const servers = require( '../../servers.json' );
module.exports = {
    /**
     *
     * @param {Collection<string, OAuth2Guild>} guilds
     */
    validateServers: async ( guilds ) =>
    {
        /**
        *
        * @param {Guild} unownedServer
        */
        const leaveServer = async ( unownedServer ) =>
        {
            await unownedServer.leave().then( async ( leftServer ) =>
            {
                console.log( `Left unowned server ${ leftServer }` );
            }, console.trace );
        };
        /**
         *
         * @param {Guild} unapprovedServer
         */
        const deleteServer = async ( unapprovedServer ) =>
        {
            await unapprovedServer.delete().then( async ( deletedServer ) =>
            {
                console.log( `Deleted unapproved server ${ deletedServer.name }` );
            }, console.trace );
        };
        for ( const guild of guilds )
        {
            const server = guild[ 1 ];
            if ( !server.owner )
            {
                await server.fetch().then( leaveServer, console.trace );
            } else
            {
                let accepted = false;
                for ( const approvedServer of servers )
                {
                    if ( server.name === approvedServer.name )
                    {
                        accepted = true;
                        break;
                    }
                }
                if ( !accepted )
                {
                    await server.fetch().then( deleteServer, console.trace );
                }
            }
        }
    }
};
