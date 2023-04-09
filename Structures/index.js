const { Client, Partials, Collection } = require("discord.js")
const ms = require("ms")
const { promisify } = require("util")
const { glob } = require("glob")
const PG = promisify(glob)
const Ascii = require("ascii-table")
require("dotenv").config()
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials

const client = new Client({
    intents: 131071,
    partials: [Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent],
    allowedMentions: { parse: ["everyone", "users", "roles"] },
    rest: { timeout: ms("1m") }
})

client.commands = new Collection()

const Handlers = ["Events", "Errors", "Commands"]

Handlers.forEach(handler => {

    require(`./Handlers/${handler}`)(client, PG, Ascii)

})

// Load all command files
PG("./commands/**/*.js").then(commands => {
    for (const commandFile of commands) {
        const command = require(commandFile)
        client.commands.set(command.name, command)
    }
})

client.on("interactionCreate", async interaction => {

    if (!interaction.isCommand()) return

    const { commandName } = interaction

    const command = client.commands.get(commandName)

    if (!command) return

    try {
        await command.execute(interaction, client)
    } catch (error) {
        console.error(error)
        await interaction.reply({ content: "An error occurred while executing this command!", ephemeral: true })
    }

})

client.login(process.env.DISCORD_TOKEN)
