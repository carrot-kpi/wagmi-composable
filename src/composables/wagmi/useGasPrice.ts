import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type GetGasPriceParameters,
    type GetGasPriceErrorType,
    type GetGasPriceReturnType,
    type Config,
    getGasPrice,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseGasPriceReturnType {
    loading: Ref<boolean>;
    error: Ref<GetGasPriceErrorType | undefined>;
    gasPrice: Ref<GetGasPriceReturnType | undefined>;
}

export function useGasPrice<
    config extends Config,
    chainId extends
        config["chains"][number]["id"] = config["chains"][number]["id"],
>(
    params?: MaybeRefOrGetter<GetGasPriceParameters<config, chainId>>,
): UseGasPriceReturnType {
    const loading = ref(false);
    const error = ref<GetGasPriceErrorType | undefined>();
    const gasPrice = ref<GetGasPriceReturnType | undefined>();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        gasPrice.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            gasPrice.value = await getGasPrice(config, newParams);
        } catch (thrown) {
            error.value = thrown as GetGasPriceErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, gasPrice };
}
