import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type GetTransactionParameters,
    type GetTransactionErrorType,
    type GetTransactionReturnType,
    type Config,
    getTransaction,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseTransactionReturnType<
    config extends Config = Config,
    chainId extends
        config["chains"][number]["id"] = config["chains"][number]["id"],
> {
    loading: Ref<boolean>;
    error: Ref<GetTransactionErrorType | undefined>;
    transaction: Ref<GetTransactionReturnType<config, chainId> | undefined>;
}

export function useTransaction<
    config extends Config,
    chainId extends
        config["chains"][number]["id"] = config["chains"][number]["id"],
>(
    params?: MaybeRefOrGetter<GetTransactionParameters<config, chainId>>,
): UseTransactionReturnType<config, chainId> {
    const loading = ref(false);
    const error = ref<GetTransactionErrorType | undefined>();
    const transaction = ref<
        GetTransactionReturnType<config, chainId> | undefined
    >();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        transaction.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            transaction.value = await getTransaction(config, newParams);
        } catch (thrown) {
            error.value = thrown as GetTransactionErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, transaction };
}
