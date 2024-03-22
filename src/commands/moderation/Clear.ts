import {
    ApplicationCommandOptionType,
    ChannelType,
    ChatInputCommandInteraction,
    Collection,
    EmbedBuilder,
    GuildMember,
    Message,
    PermissionFlagsBits,
    TextChannel,
} from "discord.js";

import Command from "../../base/classes/Command";
import Category from "../../base/enums/Category";
import CustomClient from "../../base/classes/CustomClient";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class Clear extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "clear",
            description: "Clear messages from a channel",
            category: Category.Moderation,
            default_member_permissions: PermissionFlagsBits.ManageMessages,
            cooldown: 3,
            dm_permission: false,
            dev: false,
            options: [
                {
                    name: "amount",
                    description: "The amount of messages to clear - Max 100",
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                },
                {
                    name: "target",
                    description:
                        "Select a user to delete messages from - Default all users",
                    type: ApplicationCommandOptionType.User,
                    required: false,
                },
                {
                    name: "channel",
                    description:
                        "Select a channel to delete messages from - Default current channel",
                    type: ApplicationCommandOptionType.User,
                    required: false,
                    channel_types: [ChannelType.GuildText],
                },
                {
                    name: "silent",
                    description:
                        "Don't send message to the channel after clearing messages",
                    type: ApplicationCommandOptionType.Boolean,
                    required: false,
                },
            ],
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const amount = interaction.options.getInteger("amount")!;

        const channel = (interaction.options.getChannel("channel") ||
            interaction.channel) as TextChannel;

        const target = interaction.options.getMember("target") as GuildMember;

        const silent = interaction.options.getBoolean("silent") || false;

        const errorEmbed = new EmbedBuilder().setColor("Red");

        if (amount < 1 || amount > 100)
            return interaction.reply({
                embeds: [
                    errorEmbed.setDescription(
                        "❌ Amount must be between 1 and 100"
                    ),
                ],
                ephemeral: true,
            });

        const messages: Collection<
            string,
            Message<true>
        > = await channel.messages.fetch({ limit: 100 });

        const filteredMessages = target
            ? messages.filter((m) => m.author.id === target.id)
            : messages;

        let deleted = 0;

        try {
            deleted = (
                await channel.bulkDelete(
                    Array.from(filteredMessages.keys()).slice(0, amount),
                    true
                )
            ).size;
        } catch {
            return interaction.reply({
                embeds: [
                    errorEmbed.setDescription(
                        "❌ An error occurred while trying to delete messages"
                    ),
                ],
                ephemeral: true,
            });
        }

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Orange")
                    .setDescription(
                        `🗑️ Cleared \`${deleted}\` messages${
                            target ? ` from ${target}` : ""
                        } in ${channel}`
                    ),
            ],
            ephemeral: true,
        });

        if (!silent)
            channel
                .send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Orange")
                            .setAuthor({ name: `🗑️ Clear | ${channel.name}` })
                            .setDescription(
                                `🗑️ **Cleared** \`${deleted}\` messages${
                                    target ? ` from ${target}` : ""
                                }`
                            )
                            .setTimestamp()
                            .setFooter({
                                text: `Messages: ${
                                    target ? target.user.tag : "All users"
                                }`,
                            }),
                    ],
                })
                .then(async (msg) => await msg.react("🗑️"));

        const guild = await GuildConfig.findOne({
            guildId: interaction.guildId,
        });

        if (
            guild &&
            guild?.logs?.moderation?.enabled &&
            guild?.logs?.moderation?.channelId
        )
            (
                (await interaction.guild?.channels.fetch(
                    guild.logs?.moderation.channelId
                )) as TextChannel
            )?.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Orange")
                        .setThumbnail(interaction.user.displayAvatarURL())
                        .setAuthor({ name: `🗑️ Clear` })
                        .setDescription(
                            `**Channel:** ${channel}
                             **Messages:** \`${target ? target : "All"}\`
                             **Amount:** \`${deleted}\`
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
