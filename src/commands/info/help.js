async slashRun(client, interaction) {
    const commandFolders = fs.readdirSync(path.join(__dirname, '../../Commands'));
    const helpEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Available Commands');

    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(path.join(__dirname, '../../Commands', folder))
            .filter(file => file.endsWith('.js'));

        if (commandFiles.length > 0) {
            let commandList = '';
            for (const file of commandFiles) {
                const CommandClass = require(`../../Commands/${folder}/${file}`);
                
                // Check if CommandClass is a function (constructor)
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
}
