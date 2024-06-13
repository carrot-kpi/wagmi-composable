import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type Config,
    type GetEnsNameReturnType,
    type GetEnsNameErrorType,
    type GetEnsNameParameters,
    getEnsName,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseEnsNameReturnType {
    loading: Ref<boolean>;
    error: Ref<GetEnsNameErrorType | undefined>;
    ensName: Ref<GetEnsNameReturnType | undefined>;
}

export function useEnsName<config extends Config>(
    params?: MaybeRefOrGetter<GetEnsNameParameters<config>>,
): UseEnsNameReturnType {
    const loading = ref(false);
    const error = ref<GetEnsNameErrorType | undefined>();
    const ensName = ref<GetEnsNameReturnType | undefined>();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        ensName.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            ensName.value = await getEnsName(config, newParams);
        } catch (thrown) {
            error.value = thrown as GetEnsNameErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, ensName };
}
