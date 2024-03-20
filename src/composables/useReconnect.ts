import { ref, type Ref } from "vue";
import {
    type ReconnectParameters,
    type ReconnectErrorType,
    reconnect,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseReconnectReturnType {
    loading: Ref<boolean>;
    error: Ref<ReconnectErrorType | undefined>;
    reconnect: (params: ReconnectParameters) => void;
}

export function useReconnect(): UseReconnectReturnType {
    const loading = ref(false);
    const error = ref<ReconnectErrorType | undefined>();

    const config = useWagmiConfig();

    function augmentedReconnect(params: ReconnectParameters) {
        loading.value = false;
        error.value = undefined;

        loading.value = true;
        reconnect(config, params)
            .catch((error) => {
                error.value = error as ReconnectErrorType;
            })
            .finally(() => {
                loading.value = false;
            });
    }

    return { loading, error, reconnect: augmentedReconnect };
}
