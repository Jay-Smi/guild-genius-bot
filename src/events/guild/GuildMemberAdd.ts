import { EmbedBuilder, Events, GuildMember, TextChannel } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";

export default class GuildMemberAdd extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.GuildMemberAdd,
            description: "Guild member join event",
            once: false,
        });
    }

    async Execute(guildMember: GuildMember) {
        const { data: currentGuild }: { data: DBGuild | null } =
            await this.client.supabase
                .from("guilds")
                .select()
                .eq("discord_server_id", +guildMember.guild.id)
                .limit(1)
                .maybeSingle();

        if (!currentGuild)
            return console.log(
                "Guild not found in database, GuildMemberAddEvent Error"
            );

        if (
            currentGuild.logs &&
            currentGuild.logs.joinleave &&
            currentGuild.logs.joinleave.enabled &&
            currentGuild.logs.joinleave.channelId
        ) {
            const channel = guildMember.guild.channels.cache.get(
                currentGuild.logs.joinleave.channelId
            ) as TextChannel;

            if (!channel) return;

            channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setTitle(
                            `Welcome ${guildMember} to ${guildMember.guild.name}`
                        )
                        .setDescription(
                            `This guild manages its users with Guild Genius. Please follow this link to set up your characters`
                        )
                        .setThumbnail(guildMember.user.displayAvatarURL()),
                ],
            });
        }
    }
}
