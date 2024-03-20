import { ref, type Ref, watchEffect, type UnwrapRef } from "vue";
import {
    getConnectors,
    watchConnectors,
    type GetConnectorsReturnType,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export type UseConnectorsReturnType = Ref<UnwrapRef<GetConnectorsReturnType>>;

export function useConnectors(): UseConnectorsReturnType {
    const config = useWagmiConfig();
    const connectors = ref<GetConnectorsReturnType>(getConnectors(config));

    watchEffect((onCleanup) => {
        const unwatch = watchConnectors(config, {
            onChange() {
                connectors.value = getConnectors(config);
            },
        });
        onCleanup(unwatch);
    });

    return connectors;
}
