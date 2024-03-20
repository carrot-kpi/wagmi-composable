import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type GetFeeHistoryParameters,
    type GetFeeHistoryErrorType,
    type GetFeeHistoryReturnType,
    type Config,
    getFeeHistory,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseFeeHistoryReturnType {
    loading: Ref<boolean>;
    error: Ref<GetFeeHistoryErrorType | undefined>;
    feeHistory: Ref<GetFeeHistoryReturnType | undefined>;
}

export function useFeeHistory<
    config extends Config,
    chainId extends
        config["chains"][number]["id"] = config["chains"][number]["id"],
>(
    params?: MaybeRefOrGetter<GetFeeHistoryParameters<config, chainId>>,
): UseFeeHistoryReturnType {
    const loading = ref(false);
    const error = ref<GetFeeHistoryErrorType | undefined>();
    const feeHistory = ref<GetFeeHistoryReturnType | undefined>();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        feeHistory.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            feeHistory.value = await getFeeHistory(config, newParams);
        } catch (thrown) {
            error.value = thrown as GetFeeHistoryErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, feeHistory };
}
