import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type GetEnsResolverParameters,
    type GetEnsResolverErrorType,
    type GetEnsResolverReturnType,
    type Config,
    getEnsResolver,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseEnsResolverReturnType {
    loading: Ref<boolean>;
    error: Ref<GetEnsResolverErrorType | undefined>;
    ensResolver: Ref<GetEnsResolverReturnType | undefined>;
}

export function useEnsResolver<config extends Config>(
    params?: MaybeRefOrGetter<GetEnsResolverParameters<config>>,
): UseEnsResolverReturnType {
    const loading = ref(false);
    const error = ref<GetEnsResolverErrorType | undefined>();
    const ensResolver = ref<GetEnsResolverReturnType | undefined>();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        ensResolver.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            ensResolver.value = await getEnsResolver(config, newParams);
        } catch (thrown) {
            error.value = thrown as GetEnsResolverErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, ensResolver };
}
