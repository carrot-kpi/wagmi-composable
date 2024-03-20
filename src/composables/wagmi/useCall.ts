import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type CallParameters,
    type CallErrorType,
    type CallReturnType,
    type Config,
    call,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseCallReturnType {
    loading: Ref<boolean>;
    error: Ref<CallErrorType | undefined>;
    data: Ref<CallReturnType | undefined>;
}

export function useCall<config extends Config>(
    params?: MaybeRefOrGetter<CallParameters<config>>,
): UseCallReturnType {
    const loading = ref(false);
    const error = ref<CallErrorType | undefined>();
    const data = ref<CallReturnType | undefined>();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        data.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            data.value = await call(config, newParams);
        } catch (thrown) {
            error.value = thrown as CallErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, data };
}
