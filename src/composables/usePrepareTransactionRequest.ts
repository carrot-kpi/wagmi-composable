import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type PrepareTransactionRequestParameters,
    type PrepareTransactionRequestErrorType,
    type PrepareTransactionRequestReturnType,
    type Config,
    prepareTransactionRequest,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UsePrepareTransactionRequestReturnType<
    config extends Config,
    chainId extends config["chains"][number]["id"] | undefined = undefined,
> {
    loading: Ref<boolean>;
    error: Ref<PrepareTransactionRequestErrorType | undefined>;
    transactionRequest: Ref<
        PrepareTransactionRequestReturnType<config, chainId> | undefined
    >;
}

export function usePrepareTransactionRequest<
    config extends Config,
    chainId extends config["chains"][number]["id"] | undefined = undefined,
>(
    params?: MaybeRefOrGetter<
        PrepareTransactionRequestParameters<config, chainId>
    >,
): UsePrepareTransactionRequestReturnType<config, chainId> {
    const loading = ref(false);
    const error = ref<PrepareTransactionRequestErrorType | undefined>();
    const transactionRequest = ref<
        PrepareTransactionRequestReturnType<config, chainId> | undefined
    >();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        transactionRequest.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            transactionRequest.value = await prepareTransactionRequest(
                config,
                newParams,
            );
        } catch (thrown) {
            error.value = thrown as PrepareTransactionRequestErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, transactionRequest };
}
