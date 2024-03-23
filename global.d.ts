import { Database as DB } from "./src/base/schemas/database.types";

declare global {
    type Database = DB;

    type DBGuild = Omit<
        Database["public"]["Tables"]["guilds"]["Row"],
        "logs"
    > & {
        logs: {
            moderation: {
                enabled: boolean;
                channelId: string;
            };
            joinleave: {
                enabled: boolean;
                channelId: string;
            };
        };
    };
}
