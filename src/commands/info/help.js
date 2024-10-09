const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

exports.commandBase = {
    prefixData: {
        name: 'help',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of all commands and their usage.'),
    cooldown: 5000, // 5 seconds cooldown
    ownerOnly: false, // Not restricted to the owner
    async prefixRun(client, message, args) {
        const commandFolders = fs.readdirSync(path.join(__dirname, '../../commands'));
        const helpMessage = [];

        helpMessage.push("**Available Commands:**");

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(path.join(__dirname, '../../commands', folder))
                .filter(file => file.endsWith('.js'));
            
            if (commandFiles.length > 0) {
                helpMessage.push(`\n**${folder.charAt(0).toUpperCase() + folder.slice(1)} Commands:**`);
                for (const file of commandFiles) {
                    const CommandClass = require(`../../commands/${folder}/${file}`);
                    // Ensure the CommandClass is valid
                    if (typeof CommandClass === 'function') {
                        const commandInstance = new CommandClass(client);
                        helpMessage.push(`\`${commandInstance.usages.join(", ")}\`: ${commandInstance.description}`);
                    } else {
                        console.warn(`Warning: ${file} does not export a constructor.`);
                    }
                }
            }
        }

        const finalMessage = helpMessage.join("\n");
        message.reply(finalMessage);
    },
    async slashRun(client, interaction) {
        const commandFolders = fs.readdirSync(path.join(__dirname, '../../commands'));
        const helpEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Available Commands');

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(path.join(__dirname, '../../commands', folder))
                .filter(file => file.endsWith('.js'));

            if (commandFiles.length > 0) {
                let commandList = '';
                for (const file of commandFiles) {
                    const CommandClass = require(`../../commands/${folder}/${file}`);
                    // Ensure the CommandClass is valid
                    if (typeof CommandClass === 'function') {
                        const commandInstance = new CommandClass(client);
                        commandList += `\`${commandInstance.usages.join(", ")}\`: ${commandInstance.description}\n`;
                    } else {
                        console.warn(`Warning: ${file} does not export a constructor.`);
                    }
                }
                helpEmbed.addFields({ name: folder.charAt(0).toUpperCase() + folder.slice(1) + ' Commands', value: commandList });
            }
        }

        interaction.reply({ embeds: [helpEmbed] });
    },
};
