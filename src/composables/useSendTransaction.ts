import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type SendTransactionParameters,
    type SendTransactionErrorType,
    type SendTransactionReturnType,
    type Config,
    sendTransaction,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseSendTransactionReturnType {
    loading: Ref<boolean>;
    error: Ref<SendTransactionErrorType | undefined>;
    hash: Ref<SendTransactionReturnType | undefined>;
}

export function useSendTransaction<config extends Config>(
    params?: MaybeRefOrGetter<SendTransactionParameters<config>>,
): UseSendTransactionReturnType {
    const loading = ref(false);
    const error = ref<SendTransactionErrorType | undefined>();
    const hash = ref<SendTransactionReturnType | undefined>();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        hash.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            hash.value = await sendTransaction(config, newParams);
        } catch (thrown) {
            error.value = thrown as SendTransactionErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, hash };
}
