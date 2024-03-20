import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type EstimateMaxPriorityFeePerGasParameters,
    type EstimateMaxPriorityFeePerGasErrorType,
    type EstimateMaxPriorityFeePerGasReturnType,
    estimateMaxPriorityFeePerGas,
    type Config,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseEstimateMaxPriorityFeePerGasReturnType {
    loading: Ref<boolean>;
    error: Ref<EstimateMaxPriorityFeePerGasErrorType | undefined>;
    maxPriorityFeePerGas: Ref<
        EstimateMaxPriorityFeePerGasReturnType | undefined
    >;
}

export function useEstimateMaxPriorityFeePerGas<config extends Config>(
    params?: MaybeRefOrGetter<EstimateMaxPriorityFeePerGasParameters<config>>,
): UseEstimateMaxPriorityFeePerGasReturnType {
    const loading = ref(false);
    const error = ref<EstimateMaxPriorityFeePerGasErrorType | undefined>();
    const maxPriorityFeePerGas = ref<
        EstimateMaxPriorityFeePerGasReturnType | undefined
    >();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        maxPriorityFeePerGas.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            maxPriorityFeePerGas.value = await estimateMaxPriorityFeePerGas(
                config,
                newParams,
            );
        } catch (thrown) {
            error.value = thrown as EstimateMaxPriorityFeePerGasErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, maxPriorityFeePerGas };
}
