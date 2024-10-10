const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

exports.commandBase = {
    prefixData: {
        name: 'kick',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick members from the guild.')
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

        // Check if the member executing the command has permission to kick
        if (!member.permissions.has("KICK_MEMBERS")) {
            return await interaction.reply('❌ You do not have permission to kick members!');
        }

        // Check if the target user can be kicked
        if (!targetMember.kickable) {
            return await interaction.reply('❌ I cannot kick this user. They might have a higher role or I do not have permission to kick them!');
        }

        // Proceed to kick the user
        await targetMember.kick();

        return await interaction.reply(`${targetMember} has been successfully kicked from the server. ✅`);
    },
};
