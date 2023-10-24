const {
	Collection,
	OAuth2Guild,
	ChannelType,
	EmbedBuilder,
	TextChannel
} = require( 'discord.js' );
module.exports = {
	/**
	 *
	 * @param {Collection<string, OAuth2Guild>} guilds
	 */
	setServers: async ( guilds ) =>
	{
		/**
		 *
		 * @param {TextChannel} welcomeChannel
		 */
		const inviteOwner = async ( welcomeChannel ) =>
		{
			if ( welcomeChannel.guild.memberCount < 2 )
			{
				await welcomeChannel.fetchInvites().then( ( invites ) =>
				{
					invites.forEach( ( invite ) =>
					{
						invite.delete().catch( console.trace );
					} );
				}, console.trace );
				await welcomeChannel.createInvite( {
					maxUses: 1
				} ).then( async ( invite ) =>
				{
					console.log( invite.url );
				}, console.trace );
			}
		};
		const verificationServer = guilds.find( ( server ) =>
		{
			return server.name.includes( 'Mirus Verification v' );
		} );
		if ( typeof verificationServer !== 'undefined' )
		{
			await verificationServer.fetch().then( async ( server ) =>
			{
				await server.channels.fetch().then( async ( channels ) =>
				{
					const welcomeChannel = channels.find( ( channel ) =>
					{
						return channel?.name === 'welcome';
					} );
					if ( typeof welcomeChannel !== 'undefined' && welcomeChannel?.type === ChannelType.GuildText )
					{
						welcomeChannel.permissionOverwrites.edit( server.roles.everyone, {
							ViewChannel: true
						} ).catch( console.trace );
						welcomeChannel.messages.fetch().then( ( messages ) =>
						{
							messages.forEach( ( message ) =>
							{
								message.delete().catch( console.trace );
							} );
						}, console.trace );
						const mainServer = guilds.find( ( server ) =>
						{
							server.name.includes( `Sam's Room v` );
						} );
						let memberCount = 0;
						if ( typeof mainServer !== 'undefined' )
						{
							memberCount = ( await mainServer?.fetch() ).memberCount;
						}
						welcomeChannel.send( {
							embeds: [ new EmbedBuilder( {
								title: 'Welcome to Mirus Verification',
								image: {
									url: '',
								},
								thumbnail: {
									url: '',
								},
								url: 'https://mirus-initiative.github.io',
								video: {
									url: '',
								},
								description: 'We would like to get to know you before you join our community.',
								fields: [
									{
										name: 'Why are you requesting verification?',
										value: 'In order to provide our community members an enjoyable and safe environment to thrive in, we ask that you answer a few questions and agree to our policies before you join.',
										inline: false
									},
									{
										name: 'What kind of questions are you going to be asking?',
										value: 'We do not want you to share anything personal. We will ask you how you learned about the community (for example, invited from Twitch chat, a current member invited you, etc.), your preferred notification settings, how you would like to be known as (nickname, pronouns, etc.), and whether you would like to join our rewards program.',
										inline: false
									},
									{
										name: 'What are the policies I need to accept?',
										value: 'In order to provide the best experience to you, we ask that you follow our guidelines and allow us certain permissions that allow our services to work. While it is a requirement to accept these terms in order to join the community, you have the complete right to reject our conditions or revoke the permissions you have given us, now or in the future.',
										inline: false
									},
									{
										name: 'Member Count',
										value: `${ memberCount } members have been verified.`
									}
								],
								footer: {
									text: '',
								}
							} ) ]
						} );
						await inviteOwner( welcomeChannel );
					}
				}, console.trace );
			}, console.trace );
		};
	}
};
