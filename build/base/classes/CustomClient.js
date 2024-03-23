"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Handler_1 = __importDefault(require("./Handler"));
const supabase_js_1 = require("@supabase/supabase-js");
class CustomClient extends discord_js_1.Client {
    constructor() {
        super({
            intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMembers],
        });
        this.config = require(`${process.cwd()}/data/config.json`);
        this.handler = new Handler_1.default(this);
        this.commands = new discord_js_1.Collection();
        this.subCommands = new discord_js_1.Collection();
        this.cooldowns = new discord_js_1.Collection();
        this.developmentMode = process.argv.slice(2).includes("--development");
        this.supabase = (0, supabase_js_1.createClient)(this.config.supabaseUrl, this.config.supabaseServiceRoleKey);
    }
    Init() {
        console.log(`Starting the bot in ${this.developmentMode ? "development" : "production"} mode...`);
        this.LoadHandlers();
        this.login(this.developmentMode ? this.config.devToken : this.config.token).catch((err) => console.error(err));
        //OLD: MongoDB
        // connect(
        //     this.developmentMode
        //         ? this.config.devMongoUrl
        //         : this.config.mongoUrl
        // )
        //     .then(() => console.log("Connected to MongoDB!"))
        //     .catch((err) => console.log(err));
    }
    LoadHandlers() {
        this.handler.LoadEvents();
        this.handler.LoadCommands();
    }
}
exports.default = CustomClient;
