import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type GetEnsAddressParameters,
    type GetEnsAddressErrorType,
    type GetEnsAddressReturnType,
    type Config,
    getEnsAddress,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseEnsAddressReturnType {
    loading: Ref<boolean>;
    error: Ref<GetEnsAddressErrorType | undefined>;
    ensAddress: Ref<GetEnsAddressReturnType | undefined>;
}

export function useEnsAddress<config extends Config>(
    params?: MaybeRefOrGetter<GetEnsAddressParameters<config>>,
): UseEnsAddressReturnType {
    const loading = ref(false);
    const error = ref<GetEnsAddressErrorType | undefined>();
    const ensAddress = ref<GetEnsAddressReturnType | undefined>();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        ensAddress.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            ensAddress.value = await getEnsAddress(config, newParams);
        } catch (thrown) {
            error.value = thrown as GetEnsAddressErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, ensAddress };
}
