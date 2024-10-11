const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const warnsFile = path.join(__dirname, 'warns.json');

// Ensure warns.json file exists
if (!fs.existsSync(warnsFile)) {
    fs.writeFileSync(warnsFile, JSON.stringify({}), 'utf8');
}

exports.commandBase = {
    prefixData: {
        name: 'showwarns',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('showwarns')
        .setDescription('Show the warnings for a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to check warnings for.')
                .setRequired(true)
        ),
    cooldown: 5000,
    ownerOnly: false,

    async prefixRun(client, message, args) {
        message.reply('This command is not available in prefix mode.');
    },

    async slashRun(client, interaction) {
        const targetUser = interaction.options.getUser('user');
        const guildId = interaction.guild.id;

        try {
            // Load current warnings
            const warns = JSON.parse(fs.readFileSync(warnsFile, 'utf8'));

            // Check if the guild has warnings for the user
            if (warns[guildId] && warns[guildId][targetUser.id]) {
                const userWarns = warns[guildId][targetUser.id];
                const warnsList = userWarns.map((warn, index) => `${index + 1}. ${warn}`).join('\n');
                await interaction.reply(`${targetUser} has the following warnings:\n${warnsList}`);
            } else {
                await interaction.reply(`${targetUser} has no warnings.`);
            }
        } catch (error) {
            console.error('Error reading warns file:', error);
            await interaction.reply('There was an error accessing the warning data.');
        }
    },
};
