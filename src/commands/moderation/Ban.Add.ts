import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    GuildMember,
    GuildMemberRoleManager,
    TextChannel,
} from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";
import ms from "ms";

export default class BanAdd extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "ban.add",
        });
        console.log("Ban Add command loaded!");
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getMember("target") as GuildMember;

        const reason =
            interaction.options.getString("reason") || "No reason provided.";

        const days = interaction.options.getString("days") || "0";

        const silent = interaction.options.getBoolean("silent") || false;

        const errorEmbed = new EmbedBuilder().setColor("Red");

        if (!target)
            return interaction.reply({
                embeds: [errorEmbed.setDescription("❌ User not found!")],
                ephemeral: true,
            });

        if (target.id == interaction.user.id)
            return interaction.reply({
                embeds: [
                    errorEmbed.setDescription("❌ You cannot ban yourself!"),
                ],
                ephemeral: true,
            });

        if (
            target.roles.highest.position >=
            (interaction.member?.roles as GuildMemberRoleManager).highest
                .position
        )
            return interaction.reply({
                embeds: [
                    errorEmbed.setDescription(
                        "❌ You cannot ban a user with higher or equal roles!"
                    ),
                ],
                ephemeral: true,
            });

        if (!target.bannable)
            return interaction.reply({
                embeds: [
                    errorEmbed.setDescription("❌ This user cannot be banned!"),
                ],
                ephemeral: true,
            });

        if (reason.length > 512)
            return interaction.reply({
                embeds: [
                    errorEmbed.setDescription(
                        "❌ The reason cannot be longer than 512 characters!"
                    ),
                ],
                ephemeral: true,
            });

        await target
            ?.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                            `🔨 You were **banned** from \`${interaction.guild?.name}\` by ${interaction.member}. If you would like to appeal, dm the moderator who banned you.`
                        )
                        .setImage(interaction.guild?.iconURL({})!),
                ],
            })
            .catch(() => {});

        try {
            await target?.ban({
                deleteMessageSeconds: ms(days),
                reason: reason,
            });
        } catch (err) {
            console.log(err);
            return interaction.reply({
                embeds: [
                    errorEmbed.setDescription(
                        "❌ An error occurred while banning this user, please try again!"
                    ),
                ],
                ephemeral: true,
            });
        }

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`🔨 Banned ${target} - \`${target.id}\``),
            ],
            ephemeral: true,
        });

        if (!silent)
            interaction.channel
                ?.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setAuthor({ name: `🔨 Ban | ${target.user.tag}` })
                            .setThumbnail(
                                target.user.displayAvatarURL({ size: 64 })
                            )
                            .setDescription(
                                `🔨 Banned ${target} - \`${target.id}\`
                            **Reason:** \`${reason}\`
                            ${
                                days == "0"
                                    ? ""
                                    : `This users messages in the last ${days} have been deleted.`
                            }`
                            ),
                    ],
                })
                .then(async (msg) => await msg.react("🔨"));

        const guild = await GuildConfig.findOne({
            guildId: interaction.guildId,
        });

        if (
            guild &&
            guild.logs?.moderation?.enabled &&
            guild.logs?.moderation.channelId
        )
            (
                (await interaction.guild?.channels.fetch(
                    guild.logs?.moderation.channelId
                )) as TextChannel
            )?.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setAuthor({ name: `🔨 Ban` })
                        .setThumbnail(
                            target.user.displayAvatarURL({ size: 64 })
                        )
                        .setDescription(
                            `**User** | ${target} - \`${target.id}\`
                             **Reason:** \`${reason}\`
                            ${
                                days == "0"
                                    ? ""
                                    : `This users messages in the last ${days} have been deleted.`
                            }`
                        )
                        .setTimestamp()
                        .setFooter({
                            text: `Moderator | ${interaction.user.tag} - ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL({}),
                        }),
                ],
            });
    }
}
