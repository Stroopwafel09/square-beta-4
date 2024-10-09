const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

exports.commandBase = {
    prefixData: {
        name: 'ban',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban members from the guild.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Enter target user.')
                .setRequired(true)
        ),
    cooldown: 5000, // 5 seconds cooldown
    ownerOnly: false, // Not restricted to the owner

    async prefixRun(client, message, args) {
        // Implement prefix command logic if needed
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

        // Check if the member executing the command has permission to ban
        if (!member.permissions.has("BAN_MEMBERS")) {
            return await interaction.reply('❌ You do not have permission to ban members!');
        }

        // Check if the target user can be banned
        if (!targetMember.bannable) {
            return await interaction.reply('❌ I cannot ban this user. They might have a higher role or I do not have permission to ban them!');
        }

        // Proceed to ban the user
        await targetMember.ban();

        return await interaction.reply(`${targetMember} has been successfully banned from the server. ✅`);
    },
};
