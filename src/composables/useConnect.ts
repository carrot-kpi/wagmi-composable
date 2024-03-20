import { ref, type Ref } from "vue";
import {
    type ConnectParameters,
    type ConnectErrorType,
    type Config,
    connect,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseConnectReturnType<config extends Config = Config> {
    loading: Ref<boolean>;
    error: Ref<ConnectErrorType | undefined>;
    connect: (params: ConnectParameters<config>) => void;
}

export function useConnect<
    config extends Config = Config,
>(): UseConnectReturnType<config> {
    const loading = ref(false);
    const error = ref<ConnectErrorType | undefined>();

    const config = useWagmiConfig<config>();

    function augmentedConnect(params: ConnectParameters<config>) {
        loading.value = false;
        error.value = undefined;

        loading.value = true;
        connect(config, params)
            .catch((error) => {
                error.value = error as ConnectErrorType;
            })
            .finally(() => {
                loading.value = false;
            });
    }

    return { loading, error, connect: augmentedConnect };
}
