const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs').promises;
const { EmbedBuilder, WebhookClient  } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('approvemod')
    .setDescription('Approve a submitted mod')
    .addStringOption(option =>
      option.setName('modname')
        .setDescription('The name of the mod')
        .setRequired(true)),
  async execute(interaction) {
    const modName = interaction.options.getString('modname');

    try {
      const modsData = await fs.readFile('mods.json', 'utf8');
      const mods = JSON.parse(modsData);
      const approvedMod = mods.find(mod => mod.modName === modName);

      if (!approvedMod) {
        return await interaction.reply({ content: 'Mod not found in the approval list!', ephemeral: true });
      }

      const modEmbed = new EmbedBuilder()
        .setTitle(`New mod release`)
        .setDescription(`## ${approvedMod.modName} has been released!\n **Mod by: <@${approvedMod.authorid}>** \n\n**Description:**\n${approvedMod.description}\n\n[Download Mod](${approvedMod.modLink})`)
        .setColor(0x00ff00)
        .addFields(
          { name: 'Version', value: approvedMod.version, inline: true },
          { name: 'Mod Link', value: `[Download](${approvedMod.modLink})`, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: `Mod by: ${approvedMod.author}`, iconURL: interaction.user.displayAvatarURL() });

      await interaction.channel.send({ embeds: [modEmbed] });
      await interaction.reply({ content: `Mod ${approvedMod.modName} approved and announcement sent!`, ephemeral: true });

      const webhookClient = new WebhookClient({ url: 'https://discord.com/api/webhooks/1228834634301837343/Za9ga1eczNv8ckmRvbSmBvTAkGcE-1Z8CdDrcJ0cjvYynTHPzOeT4_8hrvngL36lenK0' });
      await webhookClient.send(`Mod ${approvedMod.modName} has been approved!`);

    } catch (error) {
      console.error('Error approving mod:', error);
      await interaction.reply({ content: 'There was an error while approving the mod!', ephemeral: true });
    }
  },
};
