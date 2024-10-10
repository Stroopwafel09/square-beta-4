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
        if (!member.permissions.has("MANAGE_ROLES")) {
            return await interaction.reply('❌ You do not have permission to mute members!');
        }

        // Create a mute role if it doesn't exist
        let muteRole = guild.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) {
            try {
                muteRole = await guild.roles.create({
                    name: 'Muted',
                    permissions: [],
                });

                // Set the permissions for the role
                guild.channels.cache.forEach(channel => {
                    channel.permissionOverwrites.create(muteRole, {
                        SEND_MESSAGES: false,
                        SPEAK: false,
                    });
                });

            } catch (error) {
                console.error(error);
                return await interaction.reply('❌ Failed to create mute role!');
            }
        }

        // Add the mute role to the target member
        await targetMember.roles.add(muteRole);

        await interaction.reply(`${targetMember} has been muted for ${duration} minute(s). ✅`);

        // Set a timeout to remove the mute after the specified duration
        setTimeout(async () => {
            await targetMember.roles.remove(muteRole);
            await interaction.followUp(`${targetMember} has been unmuted. ⏰`);
        }, duration * 60 * 1000);
    },
};
