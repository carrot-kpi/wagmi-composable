import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type GetTransactionConfirmationsParameters,
    type GetTransactionConfirmationsErrorType,
    type GetTransactionConfirmationsReturnType,
    type Config,
    getTransactionConfirmations,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseTransactionConfirmationsReturnType {
    loading: Ref<boolean>;
    error: Ref<GetTransactionConfirmationsErrorType | undefined>;
    transactionConfirmations: Ref<
        GetTransactionConfirmationsReturnType | undefined
    >;
}

export function useTransactionConfirmations<
    config extends Config,
    chainId extends config["chains"][number]["id"] | undefined = undefined,
>(
    params?: MaybeRefOrGetter<
        GetTransactionConfirmationsParameters<config, chainId>
    >,
): UseTransactionConfirmationsReturnType {
    const loading = ref(false);
    const error = ref<GetTransactionConfirmationsErrorType | undefined>();
    const transactionConfirmations = ref<
        GetTransactionConfirmationsReturnType | undefined
    >();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        transactionConfirmations.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            transactionConfirmations.value = await getTransactionConfirmations(
                config,
                newParams,
            );
        } catch (thrown) {
            error.value = thrown as GetTransactionConfirmationsErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, transactionConfirmations };
}
