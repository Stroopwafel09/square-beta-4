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
        name: 'removewarn',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('removewarn')
        .setDescription('Remove a warning from a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to remove a warning from.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('index')
                .setDescription('The index of the warning to remove (0 for the first warning).')
                .setRequired(true)
        ),
    cooldown: 5000,
    ownerOnly: false,

    async prefixRun(client, message, args) {
        message.reply('This command is not available in prefix mode.');
    },

    async slashRun(client, interaction) {
        const targetUser = interaction.options.getUser('user');
        const index = interaction.options.getInteger('index');
        const guildId = interaction.guild.id;

        try {
            // Load current warnings
            let warns = {};
            try {
                warns = JSON.parse(fs.readFileSync(warnsFile, 'utf8'));
            } catch (error) {
                console.error('Error reading warns file:', error);
                return await interaction.reply('There was an error accessing the warning data.');
            }

            // Check if the guild has warnings for the user
            if (warns[guildId] && warns[guildId][targetUser.id]) {
                if (index < 0 || index >= warns[guildId][targetUser.id].length) {
                    return await interaction.reply('❌ Invalid index provided.');
                }

                // Remove the warning
                warns[guildId][targetUser.id].splice(index, 1);

                // Save warnings
                fs.writeFileSync(warnsFile, JSON.stringify(warns, null, 2));

                await interaction.reply(`Warning at index ${index} has been removed from ${targetUser}. ✅`);
            } else {
                await interaction.reply(`${targetUser} has no warnings.`);
            }
        } catch (error) {
            console.error('Error processing the removewarn command:', error);
            await interaction.reply('There was an error processing your request.');
        }
    },
};
