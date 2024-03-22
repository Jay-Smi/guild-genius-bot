"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../base/classes/Command"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
class Ban extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "ban",
            description: "Add or remove a ban from a user",
            category: Category_1.default.Moderation,
            default_member_permissions: discord_js_1.PermissionFlagsBits.BanMembers,
            dm_permission: false,
            dev: false,
            cooldown: 3,
            options: [
                {
                    name: "add",
                    description: "Ban a user",
                    type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "Select a user to ban",
                            type: discord_js_1.ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "The reason for the ban",
                            type: discord_js_1.ApplicationCommandOptionType.String,
                            required: false,
                        },
                        {
                            name: "days",
                            description: "Delete the users recent messages",
                            type: discord_js_1.ApplicationCommandOptionType.String,
                            required: false,
                            choices: [
                                { name: "None", value: "0" },
                                { name: "Previous 1 day", value: "1d" },
                                { name: "Previous 7 days", value: "7d" },
                            ],
                        },
                        {
                            name: "silent",
                            description: "Don't send a message to the channel",
                            type: discord_js_1.ApplicationCommandOptionType.Boolean,
                            required: false,
                        },
                    ],
                },
                {
                    name: "remove",
                    description: "Remove a ban from a user",
                    type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "Enter the users id to un-ban",
                            type: discord_js_1.ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "The reason for the un-ban",
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
                },
            ],
        });
        console.log("Ban command loaded!");
    }
}
exports.default = Ban;
