import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type GetWalletClientParameters,
    type GetWalletClientErrorType,
    type GetWalletClientReturnType,
    type Config,
    getWalletClient,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseWalletClientReturnType<
    config extends Config,
    chainId extends
        config["chains"][number]["id"] = config["chains"][number]["id"],
> {
    loading: Ref<boolean>;
    error: Ref<GetWalletClientErrorType | undefined>;
    walletClient: Ref<GetWalletClientReturnType<config, chainId> | undefined>;
}

export function useWalletClient<
    config extends Config,
    chainId extends
        config["chains"][number]["id"] = config["chains"][number]["id"],
>(
    params?: MaybeRefOrGetter<GetWalletClientParameters<config, chainId>>,
): UseWalletClientReturnType<config, chainId> {
    const loading = ref(false);
    const error = ref<GetWalletClientErrorType | undefined>();
    const walletClient = ref<
        GetWalletClientReturnType<config, chainId> | undefined
    >();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        walletClient.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            walletClient.value = await getWalletClient(config, newParams);
        } catch (thrown) {
            error.value = thrown as GetWalletClientErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, walletClient };
}
