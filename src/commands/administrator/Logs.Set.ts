import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    TextChannel,
} from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class LogsSet extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "logs.set",
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const logType = interaction.options.getString("log-type");

        const channel = interaction.options.getChannel(
            "channel"
        ) as TextChannel;

        await interaction.deferReply({ ephemeral: true });

        try {
            let guild = await GuildConfig.findOne({
                guildId: interaction.guildId,
            });

            if (!guild) {
                guild = await GuildConfig.create({
                    guildId: interaction.guildId,
                });
            }

            //@ts-ignore
            console.log(guild);

            //@ts-ignore
            guild.logs[`${logType}`].channelId = channel.id;

            await guild.save();

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setDescription(
                            `✅ Updated \`${logType}\` logs to send to \`#${channel.id}\`!`
                        ),
                ],
            });
        } catch (err) {
            console.log(err);
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                            "❌ An error occurred while updating the database, please try again!."
                        ),
                ],
            });
        }
    }
}
