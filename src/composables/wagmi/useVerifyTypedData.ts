import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type VerifyTypedDataParameters,
    type VerifyTypedDataErrorType,
    type VerifyTypedDataReturnType,
    type Config,
    verifyTypedData,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";
import type { TypedData } from "viem";

export interface UseVerifyTypedDataReturnType {
    loading: Ref<boolean>;
    error: Ref<VerifyTypedDataErrorType | undefined>;
    verified: Ref<VerifyTypedDataReturnType | undefined>;
}

export function useVerifyTypedData<
    const typedData extends TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | "EIP712Domain",
    config extends Config,
>(
    params?: MaybeRefOrGetter<
        VerifyTypedDataParameters<typedData, primaryType, config>
    >,
): UseVerifyTypedDataReturnType {
    const loading = ref(false);
    const error = ref<VerifyTypedDataErrorType | undefined>();
    const verified = ref<VerifyTypedDataReturnType | undefined>();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        verified.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            verified.value = await verifyTypedData(config, newParams);
        } catch (thrown) {
            error.value = thrown as VerifyTypedDataErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, verified };
}
