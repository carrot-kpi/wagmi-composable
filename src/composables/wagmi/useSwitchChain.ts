import { ref, type Ref } from "vue";
import {
    type SwitchChainParameters,
    type SwitchChainErrorType,
    switchChain,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseSwitchChainReturnType {
    loading: Ref<boolean>;
    error: Ref<SwitchChainErrorType | undefined>;
    switchChain: (params: SwitchChainParameters) => void;
}

export function useSwitchChain(): UseSwitchChainReturnType {
    const loading = ref(false);
    const error = ref<SwitchChainErrorType | undefined>();

    const config = useWagmiConfig();

    function augmentedSwitchChain(params: SwitchChainParameters) {
        loading.value = false;
        error.value = undefined;

        loading.value = true;
        switchChain(config, params)
            .catch((error) => {
                error.value = error as SwitchChainErrorType;
            })
            .finally(() => {
                loading.value = false;
            });
    }

    return { loading, error, switchChain: augmentedSwitchChain };
}
