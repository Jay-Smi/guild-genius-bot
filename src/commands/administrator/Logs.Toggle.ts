import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    TextChannel,
} from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";
import Log from "../../base/enums/Log";

export default class LogsToggle extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "logs.toggle",
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const logType = interaction.options.getString("log-type") as Log;

        const enabled = interaction.options.getBoolean("toggle");

        await interaction.deferReply({ ephemeral: true });

        try {
            // let guild = await GuildConfig.findOne({
            //     guildId: interaction.guildId,
            // });

            // if (!guild)
            //     guild = await GuildConfig.create({
            //         guildId: interaction.guildId,
            //     });

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
            currentGuild.logs[`${logType}`].enabled = enabled;

            await this.client.supabase
                .from("guilds")
                .update(currentGuild)
                .eq("discord_server_id", +interaction.guildId!);

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setDescription(
                            `✅ ${
                                enabled ? "Enabled" : "Disabled"
                            } \`${logType}\` logs!`
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
