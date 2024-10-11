const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

exports.commandBase = {
    prefixData: {
        name: 'showwarns',
        aliases: ['warnings'],
    },
    slashData: new SlashCommandBuilder()
        .setName('showwarns')
        .setDescription('Show warnings for a member in the guild.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Enter the target user.')
                .setRequired(true)
        ),
    cooldown: 5000, // 5 seconds cooldown
    ownerOnly: false, // Not restricted to the owner

    async prefixRun(client, message, args) {
        message.reply('This command is not available in prefix mode.');
    },

    async slashRun(client, interaction) {
        const targetUser = interaction.options.getUser('user');
        const guild = interaction.guild;
        const member = interaction.member;

        // Fetch the target member from the guild
        const targetMember = guild.members.cache.get(targetUser.id);

        // Check if the target user is found
        if (!targetMember) {
            return await interaction.reply('❌ User not found in this guild!');
        }

        // Logic to retrieve warnings (this is a placeholder; implement your warning retrieval system accordingly)
        // Example: You may want to fetch this from a database or an in-memory array
        const warnings = await getWarnings(targetMember.id); // Implement this function

        // Check if the user has any warnings
        if (!warnings || warnings.length === 0) {
            return await interaction.reply(`${targetMember} has no warnings.`);
        }

        // Create an embed to display warnings
        const embed = new EmbedBuilder()
            .setTitle(`Warnings for ${targetMember.user.tag}`)
            .setDescription(warnings.map((warn, index) => `${index + 1}. ${warn}`).join('\n'))
            .setColor('YELLOW');

        return await interaction.reply({ embeds: [embed] });
    },
};

// Placeholder function to retrieve warnings (implement your own logic)
async function getWarnings(userId) {
    // Example: Return an array of warning messages
    return [
        'Inappropriate language',
        'Spamming messages',
        // Add more warnings as needed
    ];
}
