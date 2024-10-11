const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const warnsFile = path.join(__dirname, 'warns.json');

// Ensure warns.json file exists
if (!fs.existsSync(warnsFile)) {
    fs.writeFileSync(warnsFile, JSON.stringify({}, null, 2), 'utf8');
}

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

        try {
            // Load current warnings
            let warns = {};
            try {
                warns = JSON.parse(fs.readFileSync(warnsFile, 'utf8'));
            } catch (error) {
                console.error('Error reading warns file:', error);
                await interaction.reply('There was an error accessing the warning data.');
                return;
            }

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

            await interaction.reply(`${targetUser} has been warned for: **${reason}** ✅`);
        } catch (error) {
            console.error('Error processing the warn command:', error);
            await interaction.reply('There was an error processing your request.');
        }
    },
};
