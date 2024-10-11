const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

exports.commandBase = {
    prefixData: {
        name: 'unwarn',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('unwarn')
        .setDescription('Remove a warning from a member.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Enter target user.')
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

        // Check if the member executing the command has permission to manage warnings
        if (!member.permissions.has("MANAGE_ROLES")) {
            return await interaction.reply('❌ You do not have permission to manage warnings!');
        }

        // Assume you have a method to remove a warning from the user
        const success = await removeWarningFromUser(targetUser.id); // Implement this function

        if (!success) {
            return await interaction.reply('❌ Failed to remove the warning. The user might not have any warnings.');
        }

        return await interaction.reply(`${targetMember} has been successfully unwarned. ✅`);
    },
};

// Example function to simulate removing a warning (implement your actual logic)
async function removeWarningFromUser(userId) {
    // Logic to remove warning from the database or data structure
    // Return true if successful, false otherwise
    return true; // Change this as per your implementation
}
