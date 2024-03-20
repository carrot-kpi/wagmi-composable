import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type VerifyMessageParameters,
    type VerifyMessageErrorType,
    type VerifyMessageReturnType,
    type Config,
    verifyMessage,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseVerifyMessageReturnType {
    loading: Ref<boolean>;
    error: Ref<VerifyMessageErrorType | undefined>;
    verified: Ref<VerifyMessageReturnType | undefined>;
}

export function useVerifyMessage<config extends Config>(
    params?: MaybeRefOrGetter<VerifyMessageParameters<config>>,
): UseVerifyMessageReturnType {
    const loading = ref(false);
    const error = ref<VerifyMessageErrorType | undefined>();
    const verified = ref<VerifyMessageReturnType | undefined>();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        verified.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            verified.value = await verifyMessage(config, newParams);
        } catch (thrown) {
            error.value = thrown as VerifyMessageErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, verified };
}
