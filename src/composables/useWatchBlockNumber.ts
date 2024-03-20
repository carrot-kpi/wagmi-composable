import { type MaybeRefOrGetter, toValue, watchEffect } from "vue";
import {
    type WatchBlockNumberParameters,
    watchBlockNumber,
    type Config,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export function useWatchBlockNumber<
    config extends Config,
    chainId extends
        config["chains"][number]["id"] = config["chains"][number]["id"],
>(params: MaybeRefOrGetter<WatchBlockNumberParameters<config, chainId>>): void {
    const config = useWagmiConfig<config>();

    watchEffect((onCleanup) => {
        const newParams = toValue(params);
        if (!newParams) return;
        const unwatch = watchBlockNumber(config, newParams);
        onCleanup(unwatch);
    });
}
