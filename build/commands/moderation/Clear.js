"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../base/classes/Command"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
const GuildConfig_1 = __importDefault(require("../../base/schemas/GuildConfig"));
class Clear extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "clear",
            description: "Clear messages from a channel",
            category: Category_1.default.Moderation,
            default_member_permissions: discord_js_1.PermissionFlagsBits.ManageMessages,
            cooldown: 3,
            dm_permission: false,
            dev: false,
            options: [
                {
                    name: "amount",
                    description: "The amount of messages to clear - Max 100",
                    type: discord_js_1.ApplicationCommandOptionType.Integer,
                    required: true,
                },
                {
                    name: "target",
                    description: "Select a user to delete messages from - Default all users",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    required: false,
                },
                {
                    name: "channel",
                    description: "Select a channel to delete messages from - Default current channel",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    required: false,
                    channel_types: [discord_js_1.ChannelType.GuildText],
                },
                {
                    name: "silent",
                    description: "Don't send message to the channel after clearing messages",
                    type: discord_js_1.ApplicationCommandOptionType.Boolean,
                    required: false,
                },
            ],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const amount = interaction.options.getInteger("amount");
            const channel = (interaction.options.getChannel("channel") ||
                interaction.channel);
            const target = interaction.options.getMember("target");
            const silent = interaction.options.getBoolean("silent") || false;
            const errorEmbed = new discord_js_1.EmbedBuilder().setColor("Red");
            if (amount < 1 || amount > 100)
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ Amount must be between 1 and 100"),
                    ],
                    ephemeral: true,
                });
            const messages = yield channel.messages.fetch({ limit: 100 });
            const filteredMessages = target
                ? messages.filter((m) => m.author.id === target.id)
                : messages;
            let deleted = 0;
            try {
                deleted = (yield channel.bulkDelete(Array.from(filteredMessages.keys()).slice(0, amount), true)).size;
            }
            catch (_h) {
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ An error occurred while trying to delete messages"),
                    ],
                    ephemeral: true,
                });
            }
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor("Orange")
                        .setDescription(`🗑️ Cleared \`${deleted}\` messages${target ? ` from ${target}` : ""} in ${channel}`),
                ],
                ephemeral: true,
            });
            if (!silent)
                channel
                    .send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Orange")
                            .setAuthor({ name: `🗑️ Clear | ${channel.name}` })
                            .setDescription(`🗑️ **Cleared** \`${deleted}\` messages${target ? ` from ${target}` : ""}`)
                            .setTimestamp()
                            .setFooter({
                            text: `Messages: ${target ? target.user.tag : "All users"}`,
                        }),
                    ],
                })
                    .then((msg) => __awaiter(this, void 0, void 0, function* () { return yield msg.react("🗑️"); }));
            const guild = yield GuildConfig_1.default.findOne({
                guildId: interaction.guildId,
            });
            if (guild &&
                ((_b = (_a = guild === null || guild === void 0 ? void 0 : guild.logs) === null || _a === void 0 ? void 0 : _a.moderation) === null || _b === void 0 ? void 0 : _b.enabled) &&
                ((_d = (_c = guild === null || guild === void 0 ? void 0 : guild.logs) === null || _c === void 0 ? void 0 : _c.moderation) === null || _d === void 0 ? void 0 : _d.channelId))
                (_g = ((yield ((_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.channels.fetch((_f = guild.logs) === null || _f === void 0 ? void 0 : _f.moderation.channelId))))) === null || _g === void 0 ? void 0 : _g.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Orange")
                            .setThumbnail(interaction.user.displayAvatarURL())
                            .setAuthor({ name: `🗑️ Clear` })
                            .setDescription(`**Channel:** ${channel}
                             **Messages:** \`${target ? target : "All"}\`
                             **Amount:** \`${deleted}\`
                             `)
                            .setTimestamp()
                            .setFooter({
                            text: `Moderator | ${interaction.user.tag} - ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL({}),
                        }),
                    ],
                });
        });
    }
}
exports.default = Clear;
