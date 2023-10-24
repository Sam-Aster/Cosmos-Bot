const { GuildMember } = require( 'discord.js' );

/**
 *
 * @param {GuildMember} newMember
 */
const addMember = async ( newMember ) =>
{
    console.log( newMember );
};
exports.addMember = addMember;
