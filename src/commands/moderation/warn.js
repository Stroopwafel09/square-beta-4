const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

exports.commandBase = {
    prefixData: {
        name: 'warn',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn members in the guild.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Enter the target user.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the warning.')
                .setRequired(false)
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

        // Check if the member executing the command has permission to warn
        if (!member.permissions.has("MANAGE_MESSAGES")) {
            return await interaction.reply('❌ You do not have permission to warn members!');
        }

        // Get the warning reason if provided
        const reason = interaction.options.getString('reason') || 'No reason provided.';

        // Log the warning (You might want to implement your own logging system)
        const logChannel = guild.channels.cache.find(channel => channel.name === 'warnings'); // Change to your preferred log channel
        if (logChannel) {
            const embed = new EmbedBuilder()
                .setTitle('Member Warned')
                .addField('User:', targetMember.toString(), true)
                .addField('Reason:', reason, true)
                .setTimestamp()
                .setColor('YELLOW');
            await logChannel.send({ embeds: [embed] });
        }

        return await interaction.reply(`${targetMember} has been warned. Reason: ${reason} ✅`);
    },
};
