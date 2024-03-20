import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type GetBalanceParameters,
    type GetBalanceErrorType,
    type GetBalanceReturnType,
    getBalance,
    type Config,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseBalanceReturnType {
    loading: Ref<boolean>;
    error: Ref<GetBalanceErrorType | undefined>;
    balance: Ref<GetBalanceReturnType | undefined>;
}

export function useBalance<config extends Config>(
    params?: MaybeRefOrGetter<GetBalanceParameters<config>>,
): UseBalanceReturnType {
    const loading = ref(false);
    const error = ref<GetBalanceErrorType | undefined>();
    const balance = ref<GetBalanceReturnType | undefined>();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        balance.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            balance.value = await getBalance(config, newParams);
        } catch (thrown) {
            error.value = thrown as GetBalanceErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, balance };
}
