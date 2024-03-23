"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../base/classes/Command"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
const Log_1 = __importDefault(require("../../base/enums/Log"));
class Logs extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "logs",
            description: "Configure the logs for your server",
            category: Category_1.default.Administrator,
            default_member_permissions: discord_js_1.PermissionFlagsBits.Administrator,
            dm_permission: false,
            dev: false,
            cooldown: 3,
            options: [
                {
                    name: "toggle",
                    description: "Toggle the logs for your server",
                    type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "log-type",
                            description: "The type of log to toggle",
                            type: discord_js_1.ApplicationCommandOptionType.String,
                            required: true,
                            choices: [
                                {
                                    name: "Moderation Logs",
                                    value: Log_1.default.Moderation,
                                },
                                {
                                    name: "Join/Leave Logs",
                                    value: Log_1.default.JoinLeave,
                                },
                            ],
                        },
                        {
                            name: "toggle",
                            description: "Toggle the log",
                            type: discord_js_1.ApplicationCommandOptionType.Boolean,
                            required: true,
                        },
                    ],
                },
                {
                    name: "set",
                    description: "Set the log channel for your server",
                    type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "log-type",
                            description: "The type of log to set",
                            type: discord_js_1.ApplicationCommandOptionType.String,
                            required: true,
                            choices: [
                                {
                                    name: "Moderation Logs",
                                    value: Log_1.default.Moderation,
                                },
                                {
                                    name: "Join/Leave Logs",
                                    value: Log_1.default.JoinLeave,
                                },
                            ],
                        },
                        {
                            name: "channel",
                            description: "Channel to set the log to",
                            type: discord_js_1.ApplicationCommandOptionType.Channel,
                            required: true,
                            channel_types: [discord_js_1.ChannelType.GuildText],
                        },
                    ],
                },
            ],
        });
    }
}
exports.default = Logs;
