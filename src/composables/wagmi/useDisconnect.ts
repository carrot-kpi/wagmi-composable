import { ref, type Ref } from "vue";
import {
    type DisconnectErrorType,
    type DisconnectParameters,
    disconnect,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseDisconnectReturnType {
    loading: Ref<boolean>;
    error: Ref<DisconnectErrorType | undefined>;
    disconnect: (params: DisconnectParameters) => void;
}

export function useDisconnect(): UseDisconnectReturnType {
    const loading = ref(false);
    const error = ref<DisconnectErrorType | undefined>();

    const config = useWagmiConfig();

    function augmentedDisconnect(params: DisconnectParameters) {
        loading.value = false;
        error.value = undefined;

        loading.value = true;
        disconnect(config, params)
            .catch((error) => {
                error.value = error as DisconnectErrorType;
            })
            .finally(() => {
                loading.value = false;
            });
    }

    return { loading, error, disconnect: augmentedDisconnect };
}
