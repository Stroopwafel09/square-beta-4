const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

exports.commandBase = {
    prefixData: {
        name: 'ping',
        aliases: ['pong'],
    },
    slashData: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong!'),
    cooldown: 5000, // 5 seconds cooldown
    ownerOnly: false, // Not restricted to the owner
    async prefixRun(client, message, args) {
        message.reply('Pong 🏓');
    },
    async slashRun(client, interaction) {
        interaction.reply('Pong 🏓');
    },
};

// Ensure you export the commandBase correctly
module.exports = exports.commandBase;
