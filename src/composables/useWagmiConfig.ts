import { inject } from "vue";
import { WAGMI_CONFIG_KEY, ensureInjectionContext } from "../commons";
import type { Config } from "@wagmi/core";

export type UseWagmiConfigReturnType<config extends Config> = config;

export function useWagmiConfig<
    config extends Config,
>(): UseWagmiConfigReturnType<config> {
    ensureInjectionContext();

    const config = inject<config>(WAGMI_CONFIG_KEY);

    if (!config)
        throw new Error(
            "No wagmi config found in Vue context, use the 'VevmAdapter' plugin to properly initialize the library.",
        );

    return config;
}
