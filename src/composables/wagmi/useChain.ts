import { watchEffect, ref, type Ref } from "vue";
import { getChainId, watchChainId, type Config } from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";
import type { Chain } from "viem";

export type UseChainReturnType = Ref<Chain | undefined>;

export function useChain<config extends Config>(): UseChainReturnType {
    const config = useWagmiConfig<config>();
    const chain = ref<Chain | undefined>();

    watchEffect((onCleanup) => {
        const chainId = getChainId(config);
        chain.value = config.chains.find((chain) => chain.id === chainId);

        const unwatch = watchChainId(config, {
            onChange(newChainId) {
                chain.value = config.chains.find(
                    (chain) => chain.id === newChainId,
                );
            },
        });

        onCleanup(unwatch);
    });

    return chain;
}
