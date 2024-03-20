import { ref, type Ref, watchEffect, type UnwrapRef } from "vue";
import {
    type GetConnectionsReturnType,
    getConnections,
    watchConnections,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export type UseConnectionsReturnType = Ref<UnwrapRef<GetConnectionsReturnType>>;

export function useConnections(): UseConnectionsReturnType {
    const config = useWagmiConfig();
    const connections = ref<GetConnectionsReturnType>(getConnections(config));

    watchEffect(() => {
        watchEffect((onCleanup) => {
            const unwatch = watchConnections(config, {
                onChange() {
                    connections.value = getConnections(config);
                },
            });
            onCleanup(unwatch);
        });
    });

    return connections;
}
