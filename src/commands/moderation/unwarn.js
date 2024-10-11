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
        
        if (!warnings.has(targetUser.id) || warnings.get(targetUser.id).length === 0) {
            return await interaction.reply('❌ This user has no warnings to remove!');
        }

        const reason = interaction.options.getString('reason');
        const userWarnings = warnings.get(targetUser.id);
        userWarnings.pop(); // Remove the last warning
        
        return await interaction.reply(`The last warning for ${targetUser} has been removed for: ${reason} ✅`);
    },
};
