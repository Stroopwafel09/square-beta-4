const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

exports.commandBase = {
    prefixData: {
        name: 'write',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('write')
        .setDescription('Write something with the bot.')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Text to write.')
                .setRequired(true)
        ),
    cooldown: 5000, // 5 seconds cooldown
    ownerOnly: false, // Not restricted to the owner
    async prefixRun(client, message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('You do not have permission to use this command.');
        }

        const text = args.join(' ');
        message.reply(text);
    },
    async slashRun(client, interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply('You do not have permission to use this command.');
        }

        const text = interaction.options.getString('text');
        interaction.reply(text);
    },
};
module.exports = Write;
