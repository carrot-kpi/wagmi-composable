import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type GetTransactionCountParameters,
    type GetTransactionCountErrorType,
    type GetTransactionCountReturnType,
    type Config,
    getTransactionCount,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseTransactionCountReturnType {
    loading: Ref<boolean>;
    error: Ref<GetTransactionCountErrorType | undefined>;
    transactionCount: Ref<GetTransactionCountReturnType | undefined>;
}

export function useTransactionCount<config extends Config>(
    params?: MaybeRefOrGetter<GetTransactionCountParameters<config>>,
): UseTransactionCountReturnType {
    const loading = ref(false);
    const error = ref<GetTransactionCountErrorType | undefined>();
    const transactionCount = ref<GetTransactionCountReturnType | undefined>();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        transactionCount.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            transactionCount.value = await getTransactionCount(
                config,
                newParams,
            );
        } catch (thrown) {
            error.value = thrown as GetTransactionCountErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, transactionCount };
}
