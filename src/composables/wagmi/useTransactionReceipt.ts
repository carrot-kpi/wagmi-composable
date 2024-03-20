import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type GetTransactionReceiptParameters,
    type GetTransactionReceiptErrorType,
    type GetTransactionReceiptReturnType,
    type Config,
    getTransactionReceipt,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseTransactionReceiptReturnType<
    config extends Config,
    chainId extends
        config["chains"][number]["id"] = config["chains"][number]["id"],
> {
    loading: Ref<boolean>;
    error: Ref<GetTransactionReceiptErrorType | undefined>;
    transactionReceipt: Ref<
        GetTransactionReceiptReturnType<config, chainId> | undefined
    >;
}

export function useTransactionReceipt<
    config extends Config,
    chainId extends
        config["chains"][number]["id"] = config["chains"][number]["id"],
>(
    params?: MaybeRefOrGetter<GetTransactionReceiptParameters>,
): UseTransactionReceiptReturnType<config, chainId> {
    const loading = ref(false);
    const error = ref<GetTransactionReceiptErrorType | undefined>();
    const transactionReceipt = ref<
        GetTransactionReceiptReturnType<config, chainId> | undefined
    >();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        transactionReceipt.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            transactionReceipt.value = await getTransactionReceipt(
                config,
                newParams,
            );
        } catch (thrown) {
            error.value = thrown as GetTransactionReceiptErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, transactionReceipt };
}
