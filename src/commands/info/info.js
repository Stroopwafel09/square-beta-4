const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

exports.commandBase = {
    prefixData: {
        name: 'info',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get information about the bot and its owner.'),
    cooldown: 5000, // 5 seconds cooldown
    ownerOnly: false, // Not restricted to the owner
    async prefixRun(client, message, args) {
        // Bot information
        const botInfo = {
            name: client.user.username,
            id: client.user.id,
            server: "https://discord.gg/Kk4jcNYSS2",
            owner: "BramPower09", // Replace with actual owner name
            ownerId: "573891601781489667", // Replace with actual owner ID
            createdAt: client.user.createdAt.toDateString(),
            guildCount: client.guilds.cache.size
        };

        // Create the response message
        const infoMessage = `
**Bot Name:** ${botInfo.name}
**Bot ID:** ${botInfo.id}
**Bot Server:** ${botInfo.server}
**Owner:** ${botInfo.owner} (ID: ${botInfo.ownerId})
**Created On:** ${botInfo.createdAt}
**Servers:** ${botInfo.guildCount}
        `.trim();

        message.reply(infoMessage);
    },
    async slashRun(client, interaction) {
        // Bot information
        const botInfo = {
            name: client.user.username,
            id: client.user.id,
            server: "https://discord.gg/Kk4jcNYSS2",
            owner: "BramPower09", // Replace with actual owner name
            ownerId: "573891601781489667", // Replace with actual owner ID
            createdAt: client.user.createdAt.toDateString(),
            guildCount: client.guilds.cache.size
        };

        // Create the response message
        const infoMessage = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Information about ${botInfo.name}`)
            .addFields(
                { name: 'Bot ID', value: botInfo.id, inline: true },
                { name: 'Bot Server', value: botInfo.server, inline: true },
                { name: 'Owner', value: `${botInfo.owner} (ID: ${botInfo.ownerId})`, inline: true },
                { name: 'Created On', value: botInfo.createdAt, inline: true },
                { name: 'Servers', value: `${botInfo.guildCount}`, inline: true }
            )
            .setTimestamp();

        interaction.reply({ embeds: [infoMessage] });
    },
};
module.exports = botInfo;
