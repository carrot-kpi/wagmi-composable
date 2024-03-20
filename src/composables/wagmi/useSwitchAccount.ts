import { ref, type Ref } from "vue";
import {
    type SwitchAccountParameters,
    type SwitchAccountErrorType,
    switchAccount,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseSwitchAccountReturnType {
    loading: Ref<boolean>;
    error: Ref<SwitchAccountErrorType | undefined>;
    switchAccount: (params: SwitchAccountParameters) => void;
}

export function useSwitchAccount(): UseSwitchAccountReturnType {
    const loading = ref(false);
    const error = ref<SwitchAccountErrorType | undefined>();

    const config = useWagmiConfig();

    function augmentedSwitchAccount(params: SwitchAccountParameters) {
        loading.value = false;
        error.value = undefined;

        loading.value = true;
        switchAccount(config, params)
            .catch((error) => {
                error.value = error as SwitchAccountErrorType;
            })
            .finally(() => {
                loading.value = false;
            });
    }

    return { loading, error, switchAccount: augmentedSwitchAccount };
}
