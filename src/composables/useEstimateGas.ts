import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type EstimateGasParameters,
    type EstimateGasErrorType,
    type EstimateGasReturnType,
    type Config,
    estimateGas,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseEstimateGasReturnType {
    loading: Ref<boolean>;
    error: Ref<EstimateGasErrorType | undefined>;
    gas: Ref<EstimateGasReturnType | undefined>;
}

export function useEstimateGas<
    config extends Config,
    chainId extends config["chains"][number]["id"] | undefined = undefined,
>(
    params?: MaybeRefOrGetter<EstimateGasParameters<config, chainId>>,
): UseEstimateGasReturnType {
    const loading = ref(false);
    const error = ref<EstimateGasErrorType | undefined>();
    const gas = ref<EstimateGasReturnType | undefined>();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        gas.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            gas.value = await estimateGas(config, newParams);
        } catch (thrown) {
            error.value = thrown as EstimateGasErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, gas };
}
