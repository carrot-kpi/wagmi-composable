import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type EstimateFeesPerGasParameters,
    type EstimateFeesPerGasErrorType,
    type EstimateFeesPerGasReturnType,
    type Config,
    estimateFeesPerGas,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";
import { type FeeValuesType } from "viem";

export interface UseEstimateFeesPerGasReturnType<
    type extends FeeValuesType = "eip1559",
> {
    loading: Ref<boolean>;
    error: Ref<EstimateFeesPerGasErrorType | undefined>;
    feesPerGas: Ref<EstimateFeesPerGasReturnType<type> | undefined>;
}

export function useEstimateFeesPerGas<
    config extends Config,
    type extends FeeValuesType = "eip1559",
>(
    params?: MaybeRefOrGetter<EstimateFeesPerGasParameters<type, config>>,
): UseEstimateFeesPerGasReturnType<type> {
    const loading = ref(false);
    const error = ref<EstimateFeesPerGasErrorType | undefined>();
    const feesPerGas = ref<EstimateFeesPerGasReturnType<type> | undefined>();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        feesPerGas.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            feesPerGas.value = await estimateFeesPerGas(config, newParams);
        } catch (thrown) {
            error.value = thrown as EstimateFeesPerGasErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, feesPerGas };
}
