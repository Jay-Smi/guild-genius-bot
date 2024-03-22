export default interface IConfig {
    token: string;
    discordClientId: string;
    mongoUrl: string;
    supabaseUrl: string;
    supabaseServiceRoleKey: string;

    devToken: string;
    devDiscordClientId: string;
    devGuildId: string;
    developerUserIds: string[];
    devMongoUrl: string;
}
