import { type MaybeRefOrGetter, toValue, watchEffect } from "vue";
import {
    type WatchContractEventParameters,
    type Config,
    watchContractEvent,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";
import type { Abi, ContractEventName } from "viem";

export function useWatchContractEvent<
    const abi extends Abi | readonly unknown[],
    eventName extends ContractEventName<abi>,
    strict extends boolean | undefined = undefined,
    config extends Config = Config,
    chainId extends
        config["chains"][number]["id"] = config["chains"][number]["id"],
>(
    params: MaybeRefOrGetter<
        WatchContractEventParameters<abi, eventName, strict, config, chainId>
    >,
): void {
    const config = useWagmiConfig<config>();

    watchEffect((onCleanup) => {
        const newParams = toValue(params);
        if (!newParams) return;
        const unwatch = watchContractEvent(config, newParams);
        onCleanup(unwatch);
    });
}
