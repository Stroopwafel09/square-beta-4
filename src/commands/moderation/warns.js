exports.warnsCommand = {
    prefixData: {
        name: 'warns',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('warns')
        .setDescription('View warnings for a member of the guild.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Enter target user.')
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
            return await interaction.reply(`${targetUser} has no warnings.`);
        }

        const userWarnings = warnings.get(targetUser.id);
        const warningList = userWarnings.map((w, index) => `**${index + 1}:** ${w}`).join('\n');

        const embed = new EmbedBuilder()
            .setTitle(`${targetUser.username}'s Warnings`)
            .setDescription(warningList)
            .setColor('RED');

        return await interaction.reply({ embeds: [embed] });
    },
};
