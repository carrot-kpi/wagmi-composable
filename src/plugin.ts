import { type Config } from "@wagmi/core";
import { type ObjectPlugin, type App } from "vue";
import { WAGMI_CONFIG_KEY } from "./commons";

export interface PluginOptions {
    wagmiConfig: Config;
}

export const VevmAdapter: ObjectPlugin<PluginOptions> = {
    install(app: App, options: PluginOptions) {
        app.provide(WAGMI_CONFIG_KEY, options.wagmiConfig);
    },
};
