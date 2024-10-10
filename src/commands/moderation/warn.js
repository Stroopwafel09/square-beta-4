const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const warnsFile = './warns.json';

exports.commandBase = {
    prefixData: {
        name: 'warn',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user for inappropriate behavior.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to warn.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the warning.')
                .setRequired(true)
        ),
    cooldown: 5000,
    ownerOnly: false,

    async prefixRun(client, message, args) {
        message.reply('This command is not available in prefix mode.');
    },

    async slashRun(client, interaction) {
        const targetUser = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const guildId = interaction.guild.id;

        // Load current warnings
        const warns = JSON.parse(fs.readFileSync(warnsFile, 'utf8'));

        // Ensure the guild has an entry
        if (!warns[guildId]) {
            warns[guildId] = {};
        }

        // Ensure the user has an entry
        if (!warns[guildId][targetUser.id]) {
            warns[guildId][targetUser.id] = [];
        }

        // Add the warning
        warns[guildId][targetUser.id].push(reason);

        // Save warnings
        fs.writeFileSync(warnsFile, JSON.stringify(warns, null, 2));

        await interaction.reply(`${targetUser} has been warned for: ${reason} ✅`);
    },
};
