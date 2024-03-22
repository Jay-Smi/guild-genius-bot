import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class Ban extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "ban",
            description: "Add or remove a ban from a user",
            category: Category.Moderation,
            default_member_permissions: PermissionFlagsBits.BanMembers,
            dm_permission: false,
            dev: false,
            cooldown: 3,
            options: [
                {
                    name: "add",
                    description: "Ban a user",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "Select a user to ban",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "The reason for the ban",
                            type: ApplicationCommandOptionType.String,
                            required: false,
                        },
                        {
                            name: "days",
                            description: "Delete the users recent messages",
                            type: ApplicationCommandOptionType.String,
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
                            type: ApplicationCommandOptionType.Boolean,
                            required: false,
                        },
                    ],
                },
                {
                    name: "remove",
                    description: "Remove a ban from a user",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "Enter the users id to un-ban",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "The reason for the un-ban",
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
        console.log("Ban command loaded!");
    }
}
