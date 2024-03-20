import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type SignTypedDataParameters,
    type SignTypedDataErrorType,
    type SignTypedDataReturnType,
    signTypedData,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseSignTypedDataReturnType {
    loading: Ref<boolean>;
    error: Ref<SignTypedDataErrorType | undefined>;
    signature: Ref<SignTypedDataReturnType | undefined>;
}

export function useSignTypedData(
    params?: MaybeRefOrGetter<SignTypedDataParameters>,
): UseSignTypedDataReturnType {
    const loading = ref(false);
    const error = ref<SignTypedDataErrorType | undefined>();
    const signature = ref<SignTypedDataReturnType | undefined>();

    const config = useWagmiConfig();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        signature.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            signature.value = await signTypedData(config, newParams);
        } catch (thrown) {
            error.value = thrown as SignTypedDataErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, signature };
}
