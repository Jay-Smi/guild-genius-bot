import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    PermissionsBitField,
} from "discord.js";
import Command from "../base/classes/Command";
import CustomClient from "../base/classes/CustomClient";
import Category from "../base/enums/Category";

export default class Test extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "test",
            description: "Test command",
            category: Category.Utilities,
            default_member_permissions:
                PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: false,
            cooldown: 5,
            options: [
                {
                    name: "one",
                    description: "First option",
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "two",
                    description: "Second option",
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ],
            dev: false,
        });
    }

    // Execute(interaction: ChatInputCommandInteraction) {
    //     interaction.reply({ content: "Test command!", ephemeral: true });
    // }
}
