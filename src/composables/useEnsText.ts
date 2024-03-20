import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type GetEnsTextParameters,
    type GetEnsTextErrorType,
    type GetEnsTextReturnType,
    type Config,
    getEnsText,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseEnsTextReturnType {
    loading: Ref<boolean>;
    error: Ref<GetEnsTextErrorType | undefined>;
    ensText: Ref<GetEnsTextReturnType | undefined>;
}

export function useEnsText<config extends Config>(
    params?: MaybeRefOrGetter<GetEnsTextParameters<config>>,
): UseEnsTextReturnType {
    const loading = ref(false);
    const error = ref<GetEnsTextErrorType | undefined>();
    const ensText = ref<GetEnsTextReturnType | undefined>();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        ensText.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            ensText.value = await getEnsText(config, newParams);
        } catch (thrown) {
            error.value = thrown as GetEnsTextErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, ensText };
}
