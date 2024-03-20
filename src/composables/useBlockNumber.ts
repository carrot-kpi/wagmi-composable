import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type GetBlockNumberParameters,
    type GetBlockNumberErrorType,
    type GetBlockNumberReturnType,
    type Config,
    getBlockNumber,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseBlockNumberReturnType {
    loading: Ref<boolean>;
    error: Ref<GetBlockNumberErrorType | undefined>;
    blockNumber: Ref<GetBlockNumberReturnType | undefined>;
}

export function useBlockNumber<
    config extends Config,
    chainId extends
        config["chains"][number]["id"] = config["chains"][number]["id"],
>(
    params?: MaybeRefOrGetter<GetBlockNumberParameters<config, chainId>>,
): UseBlockNumberReturnType {
    const loading = ref(false);
    const error = ref<GetBlockNumberErrorType | undefined>();
    const blockNumber = ref<GetBlockNumberReturnType | undefined>();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        blockNumber.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            blockNumber.value = await getBlockNumber(config, newParams);
        } catch (thrown) {
            error.value = thrown as GetBlockNumberErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, blockNumber };
}
