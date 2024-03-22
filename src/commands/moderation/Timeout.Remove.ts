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

export default class TimeoutAdd extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "timeout.remove",
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getMember("target") as GuildMember;

        const reason =
            interaction.options.getString("reason") || "No reason provided.";

        const silent = interaction.options.getBoolean("silent") || false;

        const errorEmbed = new EmbedBuilder().setColor("Red");

        if (!target)
            return interaction.reply({
                embeds: [errorEmbed.setDescription("❌ User not found!")],
                ephemeral: true,
            });

        if (target.id === interaction.user.id)
            return interaction.reply({
                embeds: [
                    errorEmbed.setDescription(
                        "❌ You cannot remove a timeout from yourself!"
                    ),
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
                        "❌ You cannot remove a timeout from a user with higher or equal roles!"
                    ),
                ],
                ephemeral: true,
            });

        if (target.communicationDisabledUntil === null)
            return interaction.reply({
                embeds: [
                    errorEmbed.setDescription(
                        `❌ ${target} is not currently **timed out**!`
                    ),
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

        try {
            await target.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Blue")
                        .setDescription(
                            `⌛ Your **time out** in \`${interaction.guild?.name}\` was removed by ${interaction.member}.
                            
                            **Reason:** \`${reason}\`
                            `
                        )
                        .setImage(interaction.guild?.iconURL({})!),
                ],
            });
        } catch {
            //Do nothing
        }

        try {
            await target.timeout(null, reason);
        } catch {
            return interaction.reply({
                embeds: [
                    errorEmbed.setDescription(
                        "❌ An error occured while trying to remove the timeout from this user!"
                    ),
                ],
                ephemeral: true,
            });
        }

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blue")
                    .setDescription(`⌛ Removed time out for ${target}`),
            ],
            ephemeral: true,
        });

        if (!silent)
            interaction.channel
                ?.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blue")
                            .setAuthor({
                                name: `⌛ Time out removed | ${target.user.tag}`,
                            })
                            .setThumbnail(
                                target.user.displayAvatarURL({ size: 64 })
                            )
                            .setDescription(
                                `⌛ Time out removed ${target} - \`${target.id}\`
                            **Reason:** \`${reason}\`
                            
                            `
                            ),
                    ],
                })
                .then(async (msg) => await msg.react("⌛"));

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
                        .setColor("Blue")
                        .setAuthor({ name: `⌛ Time out removed` })
                        .setThumbnail(
                            target.user.displayAvatarURL({ size: 64 })
                        )
                        .setDescription(
                            `**User** | ${target} - \`${target.id}\`
                             **Reason:** \`${reason}\`                                                   
                            `
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
