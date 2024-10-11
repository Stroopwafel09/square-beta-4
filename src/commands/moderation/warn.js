const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const warnings = new Map();

exports.warnCommand = {
    prefixData: {
        name: 'warn',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a member of the guild.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Enter target user.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Enter the reason for the warning.')
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
        const reason = interaction.options.getString('reason') || 'No reason provided';
        
        const targetMember = guild.members.cache.get(targetUser.id);

        if (!targetMember) {
            return await interaction.reply('❌ User not found in this guild!');
        }

        if (!warnings.has(targetUser.id)) {
            warnings.set(targetUser.id, []);
        }

        warnings.get(targetUser.id).push(reason);
        
        return await interaction.reply(`${targetMember} has been warned for: ${reason} ✅`);
    },
};
