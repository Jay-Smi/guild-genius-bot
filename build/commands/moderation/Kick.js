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
class Kick extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "kick",
            description: "Kick a user from the server",
            category: Category_1.default.Moderation,
            default_member_permissions: discord_js_1.PermissionFlagsBits.KickMembers,
            dm_permission: false,
            cooldown: 3,
            dev: false,
            options: [
                {
                    name: "target",
                    description: "The user to kick",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: "reason",
                    description: "The reason for kicking this user",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: "silent",
                    description: "Don't send a message to the channel",
                    type: discord_js_1.ApplicationCommandOptionType.Boolean,
                    required: false,
                },
            ],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const target = interaction.options.getMember("target");
            const reason = interaction.options.getString("reason") || "No reason provided.";
            const silent = interaction.options.getBoolean("silent") || false;
            const errorEmbed = new discord_js_1.EmbedBuilder().setColor("Red");
            if (!target)
                return interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ User not found!")],
                    ephemeral: true,
                });
            if (target.id == interaction.user.id)
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ You cannot kick yourself!"),
                    ],
                    ephemeral: true,
                });
            if (target.roles.highest.position >=
                ((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.roles).highest
                    .position)
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ You cannot kick a user with higher or equal roles!"),
                    ],
                    ephemeral: true,
                });
            if (!target.kickable)
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ This user cannot be kicked!"),
                    ],
                    ephemeral: true,
                });
            if (reason.length > 512)
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ The reason cannot be longer than 512 characters!"),
                    ],
                    ephemeral: true,
                });
            try {
                yield target.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Orange")
                            .setDescription(`👢 You have been **kicked** from \`${(_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.name}\` by \`${interaction.member}\`
                            If you would like to appeal, send a message to the moderator who kicked you.

                            **Reason:** \`${reason}\`
                        `)
                            .setThumbnail(target.displayAvatarURL({ size: 64 })),
                    ],
                });
            }
            catch (_h) {
                // Do nothing
            }
            try {
                yield target.kick(reason);
            }
            catch (_j) {
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ An error occured while trying to kick this user!"),
                    ],
                    ephemeral: true,
                });
            }
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor("Orange")
                        .setDescription(`👢 Kicked ${target} - \`${target.id}\``),
                ],
                ephemeral: true,
            });
            if (!silent)
                (_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Orange")
                            .setThumbnail(target.displayAvatarURL({ size: 64 }))
                            .setAuthor({
                            name: `👢 Kick | ${target.user.tag}`,
                        })
                            .setDescription(`**Reason:** \`${reason}\``)
                            .setTimestamp()
                            .setFooter({ text: `ID: ${target.id}` }),
                    ],
                }).then((msg) => __awaiter(this, void 0, void 0, function* () { return yield msg.react("👢"); }));
            const guild = yield GuildConfig_1.default.findOne({
                guildId: interaction.guildId,
            });
            if (guild &&
                ((_d = guild === null || guild === void 0 ? void 0 : guild.logs) === null || _d === void 0 ? void 0 : _d.moderation.enabled) &&
                ((_f = (_e = guild === null || guild === void 0 ? void 0 : guild.logs) === null || _e === void 0 ? void 0 : _e.moderation) === null || _f === void 0 ? void 0 : _f.channelId))
                (yield ((_g = interaction.guild) === null || _g === void 0 ? void 0 : _g.channels.fetch(guild.logs.moderation.channelId))).send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Orange")
                            .setThumbnail(target.displayAvatarURL())
                            .setAuthor({
                            name: `👢 Kick `,
                        })
                            .setDescription(`
                            **User:** ${target} - \`${target.id}\`
                            **Reason:** \`${reason}\`
                        `)
                            .setTimestamp()
                            .setFooter({
                            text: `Moderator | ${interaction.user.tag} | ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL({}),
                        }),
                    ],
                });
        });
    }
}
exports.default = Kick;
