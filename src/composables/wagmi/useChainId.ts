import { watchEffect, ref, type Ref, type UnwrapRef } from "vue";
import {
    type GetChainIdReturnType,
    type Config,
    getChainId,
    watchChainId,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export type UseChainIdReturnType<config extends Config> = Ref<
    GetChainIdReturnType<config>
>;

export function useChainId<
    config extends Config,
>(): UseChainIdReturnType<config> {
    const config = useWagmiConfig<config>();
    const chainId = ref(getChainId(config));

    watchEffect((onCleanup) => {
        const unwatch = watchChainId(config, {
            onChange(newChainId) {
                chainId.value = newChainId as UnwrapRef<
                    GetChainIdReturnType<config>
                >;
            },
        });
        onCleanup(unwatch);
    });

    return chainId;
}
