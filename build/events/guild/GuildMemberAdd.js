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
const Event_1 = __importDefault(require("../../base/classes/Event"));
class GuildMemberAdd extends Event_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.GuildMemberAdd,
            description: "Guild member join event",
            once: false,
        });
    }
    Execute(guildMember) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: currentGuild } = yield this.client.supabase
                .from("guilds")
                .select()
                .eq("discord_server_id", +guildMember.guild.id)
                .limit(1)
                .maybeSingle();
            if (!currentGuild)
                return console.log("Guild not found in database, GuildMemberAddEvent Error");
            if (currentGuild.logs &&
                currentGuild.logs.joinleave &&
                currentGuild.logs.joinleave.enabled &&
                currentGuild.logs.joinleave.channelId) {
                const channel = guildMember.guild.channels.cache.get(currentGuild.logs.joinleave.channelId);
                if (!channel)
                    return;
                channel.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Green")
                            .setTitle(`Welcome ${guildMember.user.tag} to ${guildMember.guild.name}`)
                            .setDescription(`This guild manages its users with Guild Genius. Please follow this link to set up your characters`)
                            .setThumbnail(guildMember.user.displayAvatarURL()),
                    ],
                });
            }
        });
    }
}
exports.default = GuildMemberAdd;
