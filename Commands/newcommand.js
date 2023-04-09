const { Client, ChatInputCommandInteraction } = require("discord.js")

module.exports = {
    name: "newcommand",
    description: "A new command",
    category: "General",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        await interaction.reply("This is a new command!");
    }
}
