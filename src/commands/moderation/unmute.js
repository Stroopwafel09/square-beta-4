const { SlashCommandBuilder } = require('@discordjs/builders');

exports.commandBase = {
    prefixData: {
        name: 'unmute',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute members who are currently muted.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Enter target user to unmute.')
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

        // Check if the member executing the command has permission to unmute
        if (!member.permissions.has("MODERATE_MEMBERS")) {
            return await interaction.reply('❌ You do not have permission to unmute members!');
        }

        // Remove timeout if the user is muted
        if (targetMember.isCommunicationDisabled()) {
            await targetMember.timeout(null, 'Unmuted by command');
            return await interaction.reply(`${targetMember} has been unmuted. ✅`);
        } else {
            return await interaction.reply('❌ This user is not muted!');
        }
    },
};
