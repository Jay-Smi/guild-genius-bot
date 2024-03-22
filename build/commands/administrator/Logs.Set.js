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
const SubCommand_1 = __importDefault(require("../../base/classes/SubCommand"));
class LogsSet extends SubCommand_1.default {
    constructor(client) {
        super(client, {
            name: "logs.set",
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const logType = interaction.options.getString("log-type");
            const channel = interaction.options.getChannel("channel");
            yield interaction.deferReply({ ephemeral: true });
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
                const { data: currentGuild } = yield this.client.supabase
                    .from("guilds")
                    .select()
                    .eq("discord_server_id", +interaction.guildId)
                    .limit(1)
                    .maybeSingle();
                if (!currentGuild)
                    return interaction.editReply({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setColor("Red")
                                .setDescription("❌ Guild not found in the database, report this bug to admin, try removing bot from discord server and re-inviting it!"),
                        ],
                    });
                currentGuild.logs = Object.assign(Object.assign({}, currentGuild.logs), { [`${logType}`]: Object.assign({}, (_a = currentGuild.logs) === null || _a === void 0 ? void 0 : _a[`${logType}`]) });
                //@ts-ignore
                currentGuild.logs[`${logType}`].channelId = channel.id;
                yield this.client.supabase
                    .from("guilds")
                    .update(currentGuild)
                    .eq("discord_server_id", +interaction.guildId);
                return interaction.editReply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Green")
                            .setDescription(`✅ Updated \`${logType}\` logs to send to \`#${channel.id}\`!`),
                    ],
                });
            }
            catch (err) {
                console.log(err);
                return interaction.editReply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Red")
                            .setDescription("❌ An error occurred while updating the database, please try again!."),
                    ],
                });
            }
        });
    }
}
exports.default = LogsSet;
