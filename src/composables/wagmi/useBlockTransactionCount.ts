import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type GetBlockTransactionCountParameters,
    type GetBlockTransactionCountErrorType,
    type GetBlockTransactionCountReturnType,
    type Config,
    getBlockTransactionCount,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseBlockTransactionCountReturnType {
    loading: Ref<boolean>;
    error: Ref<GetBlockTransactionCountErrorType | undefined>;
    blockTransactionCount: Ref<GetBlockTransactionCountReturnType | undefined>;
}

export function useBlockTransactionCount<
    config extends Config,
    chainId extends
        config["chains"][number]["id"] = config["chains"][number]["id"],
>(
    params?: MaybeRefOrGetter<
        GetBlockTransactionCountParameters<config, chainId>
    >,
): UseBlockTransactionCountReturnType {
    const loading = ref(false);
    const error = ref<GetBlockTransactionCountErrorType | undefined>();
    const blockTransactionCount = ref<
        GetBlockTransactionCountReturnType | undefined
    >();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        blockTransactionCount.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            blockTransactionCount.value = await getBlockTransactionCount(
                config,
                newParams,
            );
        } catch (thrown) {
            error.value = thrown as GetBlockTransactionCountErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, blockTransactionCount };
}
