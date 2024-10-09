const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

exports.commandBase = {
    prefixData: {
        name: 'unban',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a member from the guild.')
        .addStringOption(option =>
            option.setName('user_id')
                .setDescription('Enter the ID of the user to unban.')
                .setRequired(true)
        ),
    cooldown: 5000, // 5 seconds cooldown
    ownerOnly: false, // Not restricted to the owner

    async prefixRun(client, message, args) {
        message.reply('This command is not available in prefix mode.');
    },

    async slashRun(client, interaction) {
        const userId = interaction.options.getString('user_id');
        const guild = interaction.guild;
        const member = interaction.member;

        // Check if the member executing the command has permission to unban
        if (!member.permissions.has("BAN_MEMBERS")) {
            return await interaction.reply('❌ You do not have permission to unban members!');
        }

        // Defer the reply to indicate processing
        await interaction.deferReply();

        // Attempt to unban the user
        try {
            await guild.members.unban(userId);
            return await interaction.editReply(`✅ User with ID \`${userId}\` has been successfully unbanned from the server.`);
        } catch (error) {
            console.error(error);
            if (error.code === 50013) {
                return await interaction.editReply('❌ I cannot unban this user. They might not be banned or I do not have permission to do so.');
            } else if (error.code === 10062) {
                return; // Interaction was already acknowledged
            }
            return await interaction.editReply('❌ An error occurred while trying to unban the user. Please check the user ID and try again.');
        }
    },
};
