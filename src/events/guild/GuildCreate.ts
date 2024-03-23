import { EmbedBuilder, Events, Guild } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";

export default class GuildCreate extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.GuildCreate,
            description: "Guild join event",
            once: false,
        });
    }

    async Execute(guild: Guild) {
        try {
            const { data: currentGuild } = await this.client.supabase
                .from("guilds")
                .select()
                .eq("discord_server_id", +guild.id)
                .limit(1)
                .maybeSingle();

            if (!currentGuild) {
                await this.client.supabase
                    .from("guilds")
                    .insert([
                        {
                            discord_server_id: +guild.id,
                            name: guild.name,
                            icon: guild.iconURL() || null,
                            owner_id: +guild.ownerId,
                            region: guild.preferredLocale,
                        },
                    ])
                    .select();
            } else {
                await this.client.supabase
                    .from("guilds")
                    .update({
                        name: guild.name,
                        icon: guild.iconURL() || null,
                        owner_id: +guild.ownerId,
                        region: guild.preferredLocale,
                    })
                    .eq("id", currentGuild.id);
            }

            //OLD: MongoDB
            // if (!(await GuildConfig.exists({ guildId: guild.id })))
            //     await GuildConfig.create({ guildId: guild.id });
        } catch (err) {
            console.log(err);
        }

        const owner = await guild.fetchOwner();

        owner
            ?.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setDescription(
                            "Hey! Thanks for adding me to your server! 🎉"
                        ),
                ],
            })
            .catch();
    }
}
