"use strict";

const { Client, GatewayIntentBits, GuildExplicitContentFilter, GuildDefaultMessageNotifications, GuildVerificationLevel, GuildMember, ChannelType, PermissionFlagsBits } = require( 'discord.js' );

const servers = require( './serverList.json' );
const { token } = require( './config.json' );

/**
 *
 * @param {GuildMember} owner
 */
const messageOwnerAndLeave = async ( owner ) =>
{

    await owner.createDM().then( async ( dm ) =>
    {
        await dm.send( 'I am not allowed to join other servers.' ).then( async ( message ) =>
        {
            console.log( message.content );
        } );
    } );
    await owner.guild.leave().then( async ( leftGuild ) =>
    {
        console.log( `Left unowned server ${ leftGuild.name }` );
    } ).catch( handleError );
};

const client = new Client( {
    intents: [ GatewayIntentBits.Guilds ],
} );

// @ts-ignore
const handleError = ( error ) =>
{
    console.trace( error );
};

client.on( 'ready', async ( cosmos ) =>
{
    console.log( `Client online as ${ cosmos.user.displayName }. Checking servers....` );
    await cosmos.guilds.fetch().then( async ( guilds ) =>
    {
        for ( const thisGuild of guilds )
        {
            const guild = thisGuild[ 1 ];
            const moveOn = () =>
            {
                console.log( 'Checking on other servers....' );
            };
            if ( !guild.owner )
            {
                await guild.fetch().then( async ( unownedGuild ) =>
                {
                    await unownedGuild.fetchOwner().then( messageOwnerAndLeave ).catch( handleError );
                } ).catch( handleError ).finally( moveOn );
                continue;
            }
            if ( !servers.includes( guild.name ) )
            {
                await guild.fetch().then( async ( unrecognizedGuild ) =>
                {
                    await unrecognizedGuild.delete().then( ( deletedGuild ) =>
                    {
                        console.log( `Deleted unrecognized server ${ deletedGuild.name }` );
                    } ).catch( handleError );
                } ).catch( handleError ).finally( moveOn );
            }
        };
    } ).catch( handleError ).finally( () =>
    {
        console.log( 'Servers checked.' );
    } );
    console.log( 'Validating servers....' );
    cosmos.guilds.fetch().then( async ( guilds ) =>
    {
        if ( guilds.size < servers.length )
        {
            console.log( 'Not enough servers found.' );
            for ( const server of servers )
            {
                if ( guilds.has( server ) )
                {
                    console.log( `Server exists ${ server }` );
                    continue;
                }
                console.log( `Creating server ${ server }` );
                await cosmos.guilds.create( {
                    name: server,
                    explicitContentFilter: GuildExplicitContentFilter.AllMembers,
                    defaultMessageNotifications: GuildDefaultMessageNotifications.OnlyMentions,
                    verificationLevel: GuildVerificationLevel.Medium
                } ).then( ( newGuild ) =>
                {
                    console.log( `Server created ${ newGuild.name }` );
                } ).catch( handleError ).finally( () =>
                {
                    console.log( 'Checking to see if more servers need to be made.' );
                } );
            }
        }
    } ).catch( handleError ).finally( () =>
    {
        console.log( 'Servers validated' );
    } );
} );
client.on( 'guildCreate', async ( newGuild ) =>
{
    console.log( `Server joined ${ newGuild.name }` );
    await newGuild.fetchOwner().then( async ( owner ) =>
    {
        if ( owner.id !== newGuild.client.user.id )
        {
            messageOwnerAndLeave( owner );
        }
    } ).catch( handleError );
    console.log( `Checking server roles ${ newGuild }` );
    await newGuild.roles.everyone.edit( {
        permissions: []
    } ).then( ( role ) =>
    {
        console.log( `Role updated ${ role.name }` );
    } ).catch( handleError );
    console.log( `Checking server channels ${ newGuild.name }` );
    await newGuild.channels.fetch().then( async ( channels ) =>
    {
        console.log( `Deleting default channels ${ newGuild.name }` );
        for ( const channel of channels )
        {
            const thisChannel = channel[ 1 ];
            await thisChannel?.fetch().then( async ( channel ) =>
            {
                await channel.delete().catch( handleError );
            } );
        }
        console.log( `Server default channels deleted ${ newGuild.name }` );
    } );
    await newGuild.channels.create( {
        name: 'welcome',
        type: ChannelType.GuildText,
        topic: 'Hello, my new friends!',
        permissionOverwrites: [ {
            id: newGuild.roles.everyone,
            allow: [ PermissionFlagsBits.ViewChannel ]
        } ]
    } ).catch( handleError ).finally( async () =>
    {
        console.log( `Server channels created ${ newGuild.name }` );
    } );
    console.log( `Checking member count....` );
    if ( newGuild.memberCount == 1 )
    {
        console.log( `No members, checking invites....` );
        await newGuild.channels.fetch().then( async ( channels ) =>
        {
            await channels.find( ( channel ) =>
            {
                return channel?.name === 'welcome';
            } )?.fetch().then( async ( welcome ) =>
            {
                if ( welcome.isTextBased() )
                {
                    await welcome.fetchInvites().then( ( invites ) =>
                    {
                        invites.forEach( async ( invite ) =>
                        {
                            await invite.delete().then( async () =>
                            {
                                console.log( `Old invite deleted` );
                            } ).catch( handleError );
                        } );
                    } ).catch( handleError ).finally( () =>
                    {
                        console.log( 'All old invites deleted.' );
                    } );
                    await welcome.createInvite( {
                        maxUses: 1
                    } ).catch( handleError );
                    await welcome.fetchInvites().then( ( invites ) =>
                    {
                        invites.forEach( ( invite ) =>
                        {
                            console.log( invite.url );
                        } );
                    } ).catch( handleError );
                }
            } ).catch( handleError );
        } ).catch( handleError );
    } else
    {
        console.log( `There are ${ newGuild.memberCount } member(s) in ${ newGuild.name }` );
    }
} );
client.login( token ).catch( handleError );
