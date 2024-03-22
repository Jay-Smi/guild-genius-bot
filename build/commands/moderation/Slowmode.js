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
class Slowmode extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "slowmode",
            description: "Set the slowmode of a channel.",
            category: Category_1.default.Moderation,
            default_member_permissions: discord_js_1.PermissionFlagsBits.ManageChannels,
            cooldown: 3,
            dm_permission: false,
            dev: false,
            options: [
                {
                    name: "rate",
                    description: "The rate of the slowmode.",
                    type: discord_js_1.ApplicationCommandOptionType.Integer,
                    required: true,
                    choices: [
                        { name: "None", value: "0" },
                        { name: "5 seconds", value: "5" },
                        { name: "10 seconds", value: "10" },
                        { name: "15 seconds", value: "15" },
                        { name: "30 seconds", value: "30" },
                        { name: "1 minute", value: "60" },
                        { name: "2 minutes", value: "120" },
                        { name: "5 minutes", value: "300" },
                        { name: "10 minutes", value: "600" },
                        { name: "15 minutes", value: "900" },
                        { name: "30 minutes", value: "1800" },
                        { name: "1 hour", value: "3600" },
                        { name: "2 hours", value: "7200" },
                        { name: "6 hours", value: "21600" },
                    ],
                },
                {
                    name: "channel",
                    description: "The channel to set the slowmode in.",
                    type: discord_js_1.ApplicationCommandOptionType.Channel,
                    required: false,
                    channel_types: [discord_js_1.ChannelType.GuildText],
                },
                {
                    name: "reason",
                    description: "The reason for setting the slowmode.",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: "silent",
                    description: "Whether to suppress the reply.",
                    type: discord_js_1.ApplicationCommandOptionType.Boolean,
                    required: false,
                },
            ],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const messageRate = interaction.options.getInteger("rate");
            const channel = (interaction.options.getChannel("channel") ||
                interaction.channel);
            const reason = interaction.options.getString("reason") || "No reason provided.";
            const silent = interaction.options.getBoolean("silent") || false;
            const errorEmbed = new discord_js_1.EmbedBuilder().setColor("Red");
            if (messageRate < 0 || messageRate > 21600)
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ Slowmode rate must be between 0 and 6 hours (21600 seconds)!"),
                    ],
                    ephemeral: true,
                });
            try {
                channel.setRateLimitPerUser(messageRate, reason);
            }
            catch (error) {
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription(`❌ An error occurred while setting the slowmode: \`${error}\``),
                    ],
                    ephemeral: true,
                });
            }
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor("Green")
                        .setDescription("✅ Slowmode set!"),
                ],
            });
            if (!silent) {
                channel
                    .send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Green")
                            .setDescription(`🕒 The slowmode in this channel has been set to \`${messageRate}\` seconds!`)
                            .setAuthor({ name: `🕰 Slowmode | ${channel.name}` })
                            .setTimestamp()
                            .setFooter({
                            text: `Moderator: ${interaction.user.tag}`,
                        }),
                    ],
                })
                    .then((msg) => __awaiter(this, void 0, void 0, function* () { return yield msg.react("🕒"); }));
            }
            const guild = yield GuildConfig_1.default.findOne({
                guildId: interaction.guildId,
            });
            if (guild &&
                ((_b = (_a = guild === null || guild === void 0 ? void 0 : guild.logs) === null || _a === void 0 ? void 0 : _a.moderation) === null || _b === void 0 ? void 0 : _b.enabled) &&
                ((_c = guild === null || guild === void 0 ? void 0 : guild.logs) === null || _c === void 0 ? void 0 : _c.moderation.channelId)) {
                (_e = ((yield ((_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.channels.fetch(guild.logs.moderation.channelId))))) === null || _e === void 0 ? void 0 : _e.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Green")
                            .setDescription(`🕒 Slowmode set in <#${channel.id}> to \`${messageRate}\` seconds!`)
                            .setAuthor({ name: `🕰 Slowmode | ${channel.name}` })
                            .setTimestamp()
                            .setFooter({
                            text: `Moderator: ${interaction.user.tag}`,
                        }),
                    ],
                });
            }
        });
    }
}
exports.default = Slowmode;
