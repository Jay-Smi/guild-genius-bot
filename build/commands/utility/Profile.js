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
const discord_arts_1 = require("discord-arts");
class Profile extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "profile",
            description: "View your profile or someone else's profile.",
            category: Category_1.default.Utilities,
            default_member_permissions: discord_js_1.PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: false,
            cooldown: 3,
            dev: false,
            options: [
                {
                    name: "target",
                    description: "The user to view the profile of.",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    required: false,
                },
            ],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const target = (interaction.options.getMember("target") ||
                interaction.member);
            yield interaction.deferReply({ ephemeral: true });
            const buffer = yield (0, discord_arts_1.profileImage)(target.id, {
                borderColor: ["#841821", "#005b58"],
                badgesFrame: true,
                removeAvatarFrame: false,
                presenceStatus: (_a = target.presence) === null || _a === void 0 ? void 0 : _a.status,
            });
            const attachment = new discord_js_1.AttachmentBuilder(buffer).setName(`${target.user.username}_profile.png`);
            const color = (yield target.user.fetch()).accentColor;
            interaction.editReply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor(color !== null && color !== void 0 ? color : "Green")
                        .setDescription(`Profile of ${target}`)
                        .setImage(`attachment://${target.user.username}_profile.png`),
                ],
                files: [attachment],
            });
        });
    }
}
exports.default = Profile;
