const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const { token, clientId, guildId } = require('./secrets.json');

console.log("Starting bot!");

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  });
  
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
  
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}
  
const rest = new REST({ version: '9' }).setToken(token);
  
(async () => {
    try {
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: client.commands.map(command => command.data.toJSON()) }
      );
    } catch (error) {
      console.error(error);
    }
})();
  
client.once('ready', () => {
    console.log('Bot is ready!');
    console.log(`Logged in as ${client.user.tag}!`);
});
  
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
  
    const command = client.commands.get(interaction.commandName);
  
    if (!command) return;
  
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});
  
client.login(token);
