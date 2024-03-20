import { type MaybeRefOrGetter, toValue, watchEffect } from "vue";
import {
    type WatchBlocksParameters,
    watchBlocks,
    type Config,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";
import type { BlockTag } from "viem";

export function useWatchBlocks<
    config extends Config,
    chainId extends
        config["chains"][number]["id"] = config["chains"][number]["id"],
    includeTransactions extends boolean = false,
    blockTag extends BlockTag = "latest",
>(
    params: MaybeRefOrGetter<
        WatchBlocksParameters<includeTransactions, blockTag, config, chainId>
    >,
): void {
    const config = useWagmiConfig<config>();

    watchEffect((onCleanup) => {
        const newParams = toValue(params);
        if (!newParams) return;
        const unwatch = watchBlocks(config, newParams);
        onCleanup(unwatch);
    });
}
