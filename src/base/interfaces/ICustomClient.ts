import { Collection } from "discord.js";
import IConfig from "./IConfig";
import Command from "../classes/Command";
import SubCommand from "../classes/SubCommand";
import { SupabaseClient } from "@supabase/supabase-js";

export default interface ICustomClient {
    config: IConfig;
    commands: Collection<string, Command>;
    subCommands: Collection<string, SubCommand>;
    cooldowns: Collection<string, Collection<string, number>>;
    developmentMode: boolean;
    supabase: SupabaseClient<Database>;

    Init(): void;
    LoadHandlers(): void;
}
