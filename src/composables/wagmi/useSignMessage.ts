import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type SignMessageParameters,
    type SignMessageErrorType,
    type SignMessageReturnType,
    signMessage,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseSignMessageReturnType {
    loading: Ref<boolean>;
    error: Ref<SignMessageErrorType | undefined>;
    signature: Ref<SignMessageReturnType | undefined>;
}

export function useSignMessage(
    params?: MaybeRefOrGetter<SignMessageParameters>,
): UseSignMessageReturnType {
    const loading = ref(false);
    const error = ref<SignMessageErrorType | undefined>();
    const signature = ref<SignMessageReturnType | undefined>();

    const config = useWagmiConfig();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        signature.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            signature.value = await signMessage(config, newParams);
        } catch (thrown) {
            error.value = thrown as SignMessageErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, signature };
}
