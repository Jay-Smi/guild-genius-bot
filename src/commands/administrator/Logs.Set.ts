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
            //OLD: MongoDB
            // let guild = await GuildConfig.findOne({
            //     guildId: interaction.guildId,
            // });

            // if (!guild) {
            //     guild = await GuildConfig.create({
            //         guildId: interaction.guildId,
            //     });
            // }

            const { data: currentGuild } = await this.client.supabase
                .from("guilds")
                .select()
                .eq("discord_server_id", +interaction.guildId!)
                .limit(1)
                .maybeSingle();

            if (!currentGuild)
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(
                                "❌ Guild not found in the database, report this bug to admin, try removing bot from discord server and re-inviting it!"
                            ),
                    ],
                });

            currentGuild.logs = {
                ...currentGuild.logs,
                [`${logType}`]: { ...currentGuild.logs?.[`${logType}`] },
            };

            //@ts-ignore
            currentGuild.logs[`${logType}`].channelId = channel.id;

            await this.client.supabase
                .from("guilds")
                .update(currentGuild)
                .eq("discord_server_id", +interaction.guildId!);

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
