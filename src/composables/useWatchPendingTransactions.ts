import { type MaybeRefOrGetter, toValue, watchEffect } from "vue";
import {
    type WatchPendingTransactionsParameters,
    type Config,
    watchPendingTransactions,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export function useWatchPendingTransactions<
    config extends Config,
    chainId extends
        config["chains"][number]["id"] = config["chains"][number]["id"],
>(
    params: MaybeRefOrGetter<
        WatchPendingTransactionsParameters<config, chainId>
    >,
): void {
    const config = useWagmiConfig<config>();

    watchEffect((onCleanup) => {
        const newParams = toValue(params);
        if (!newParams) return;
        const unwatch = watchPendingTransactions(config, newParams);
        onCleanup(unwatch);
    });
}
