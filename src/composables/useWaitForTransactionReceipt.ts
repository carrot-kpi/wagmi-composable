import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type WaitForTransactionReceiptParameters,
    type WaitForTransactionReceiptErrorType,
    type WaitForTransactionReceiptReturnType,
    type Config,
    waitForTransactionReceipt,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseWaitForTransactionReceiptReturnType<
    config extends Config = Config,
    chainId extends
        config["chains"][number]["id"] = config["chains"][number]["id"],
> {
    loading: Ref<boolean>;
    error: Ref<WaitForTransactionReceiptErrorType | undefined>;
    receipt: Ref<
        WaitForTransactionReceiptReturnType<config, chainId> | undefined
    >;
}

export function useWaitForTransactionReceipt<
    config extends Config,
    chainId extends
        config["chains"][number]["id"] = config["chains"][number]["id"],
>(
    params?: MaybeRefOrGetter<
        WaitForTransactionReceiptParameters<config, chainId>
    >,
): UseWaitForTransactionReceiptReturnType<config, chainId> {
    const loading = ref(false);
    const error = ref<WaitForTransactionReceiptErrorType | undefined>();
    const receipt = ref<
        WaitForTransactionReceiptReturnType<config, chainId> | undefined
    >();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        receipt.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            receipt.value = await waitForTransactionReceipt(config, newParams);
        } catch (thrown) {
            error.value = thrown as WaitForTransactionReceiptErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, receipt };
}
