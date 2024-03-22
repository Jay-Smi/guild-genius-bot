import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class Timeout extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "timeout",
            description: "Manage timeouts",
            category: Category.Moderation,
            default_member_permissions: PermissionFlagsBits.MuteMembers,
            dev: false,
            dm_permission: false,
            cooldown: 3,
            options: [
                {
                    name: "add",
                    description: "Add a timeout to a user",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "The user to timeout",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "length",
                            description:
                                "The length of time to timeout this user for",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            choices: [
                                { name: "5 Minutes", value: "5m" },
                                { name: "15 Minutes", value: "15m" },
                                { name: "30 Minutes", value: "30m" },
                                { name: "1 Hour", value: "1h" },
                                { name: "3 Hours", value: "3h" },
                                { name: "6 Hours", value: "6h" },
                                { name: "12 Hours", value: "12h" },
                                { name: "1 Day", value: "1d" },
                                { name: "3 Days", value: "3d" },
                                { name: "1 Week", value: "1w" },
                                { name: "2 Weeks", value: "2w" },
                                { name: "1 Month", value: "1mo" },
                                { name: "3 Months", value: "3mo" },
                            ],
                        },
                        {
                            name: "reason",
                            description: "The reason for timing out this user",
                            type: ApplicationCommandOptionType.String,
                            required: false,
                        },
                        {
                            name: "silent",
                            description: "Don't send a message to the channel",
                            type: ApplicationCommandOptionType.Boolean,
                            required: false,
                        },
                    ],
                },
                {
                    name: "remove",
                    description: "Remove a timeout to a user",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "The user to remove the timeout from",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "The reason for removing the timeout",
                            type: ApplicationCommandOptionType.String,
                            required: false,
                        },
                        {
                            name: "silent",
                            description: "Don't send a message to the channel",
                            type: ApplicationCommandOptionType.Boolean,
                            required: false,
                        },
                    ],
                },
            ],
        });
    }
}
