const { SlashCommandBuilder } = require('@discordjs/builders'); // Import the SlashCommandBuilder
const { EmbedBuilder } = require('discord.js'); // If you're using embeds

const warnings = new Map(); // Ensure this is defined somewhere in your code

exports.unwarnCommand = {
    prefixData: {
        name: 'unwarn',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('unwarn')
        .setDescription('Remove a warning from a member of the guild.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Enter target user.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('index')
                .setDescription('Enter the index of the warning to remove.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Enter the reason for the unwarn.')
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
        
        if (!warnings.has(targetUser.id) || warnings.get(targetUser.id).length === 0) {
            return await interaction.reply('❌ This user has no warnings to remove!');
        }

        const userWarnings = warnings.get(targetUser.id);

        if (index < 1 || index > userWarnings.length) {
            return await interaction.reply(`❌ Please provide a valid index (1-${userWarnings.length}).`);
        }

        const removedWarning = userWarnings.splice(index - 1, 1)[0]; // Remove the specified warning
        
        return await interaction.reply(`The warning "${removedWarning}" for ${targetUser} has been removed for: ${interaction.options.getString('reason')} ✅`);
    },
};
