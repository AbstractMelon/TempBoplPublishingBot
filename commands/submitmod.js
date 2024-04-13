const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs').promises;
const { WebhookClient } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('submitmod')
    .setDescription('Submit a mod for approval')
    .addStringOption(option =>
      option.setName('modname')
        .setDescription('The name of the mod')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('version')
        .setDescription('The version of the mod')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('modlink')
        .setDescription('The link to the mod')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Description of the mod')
        .setRequired(true)),
  async execute(interaction) {
    const author = interaction.user.username;
    const authorid = interaction.user.id;
    const UserData = interaction.user;
    const modName = interaction.options.getString('modname');
    const version = interaction.options.getString('version');
    const modLink = interaction.options.getString('modlink');
    const description = interaction.options.getString('description');

    const modInfo = `` +
                    `# New mod! <@&1228836680035860572> \n` +
                    `**MOD INFO!**\n` +
                    `Mod submited by: ${interaction.user} \n` +
                    `Mod Name: ${modName}\n` +
                    `Mod Version: ${version}\n` +
                    `Mod Link: ${modLink}\n` +
                    `Mod Description: ${description}`;

    const webhook = new WebhookClient({ url: 'https://discord.com/api/webhooks/1228834634301837343/Za9ga1eczNv8ckmRvbSmBvTAkGcE-1Z8CdDrcJ0cjvYynTHPzOeT4_8hrvngL36lenK0' }); // Replace 'YOUR_WEBHOOK_URL' with your actual webhook URL
    await webhook.send(modInfo);

    try {
      let mods = [];
      try {
        await fs.access('mods.json');
      } catch (error) {
        await fs.writeFile('mods.json', '[]');
      }

      const modsData = await fs.readFile('mods.json', 'utf8');
      mods = JSON.parse(modsData);
      mods.push({ author, authorid, modName, version, modLink, description, UserData});
      await fs.writeFile('mods.json', JSON.stringify(mods, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving mod info to mods.json:', error);
    }

    await interaction.reply({ content: 'Mod submitted for approval!', ephemeral: true });
  },
};
