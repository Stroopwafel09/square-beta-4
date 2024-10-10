const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

exports.commandBase = {
    prefixData: {
        name: 'mute',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute members for a specified duration.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Enter target user to mute.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('Duration in minutes for the mute.')
                .setRequired(true)
        ),
    cooldown: 5000, // 5 seconds cooldown
    ownerOnly: false, // Not restricted to the owner

    async prefixRun(client, message, args) {
        message.reply('This command is not available in prefix mode.');
    },

    async slashRun(client, interaction) {
        const targetUser = interaction.options.getUser('user');
        const duration = interaction.options.getInteger('duration');
        const guild = interaction.guild;
        const member = interaction.member;

        // Fetch the target member from the guild
        const targetMember = guild.members.cache.get(targetUser.id);

        // Check if the target user is found
        if (!targetMember) {
            return await interaction.reply('❌ User not found in this guild!');
        }

        // Check if the member executing the command has permission to mute
        if (!member.permissions.has("MODERATE_MEMBERS")) {
            return await interaction.reply('❌ You do not have permission to mute members!');
        }

        // Apply the timeout
        const timeoutDuration = duration * 60 * 1000; // Convert to milliseconds
        await targetMember.timeout(timeoutDuration, 'Muted by command');

        await interaction.reply(`${targetMember} has been muted for ${duration} minute(s). ✅`);

        // Set a timeout to notify when the user is unmuted
        setTimeout(async () => {
            await interaction.followUp(`${targetMember} has been unmuted. ⏰`);
        }, timeoutDuration);
    },
};
