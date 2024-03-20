import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type GetBytecodeParameters,
    type GetBytecodeErrorType,
    type GetBytecodeReturnType,
    type Config,
    getBytecode,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";


export interface UseBytecodeReturnType {
    loading: Ref<boolean>;
    error: Ref<GetBytecodeErrorType | undefined>;
    bytecode: Ref<GetBytecodeReturnType | undefined>;
}

export function useBytecode<config extends Config>(
    params?: MaybeRefOrGetter<GetBytecodeParameters<config>>,
): UseBytecodeReturnType {
    const loading = ref(false);
    const error = ref<GetBytecodeErrorType | undefined>();
    const bytecode = ref<GetBytecodeReturnType | undefined>();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        bytecode.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            bytecode.value = await getBytecode(config, newParams);
        } catch (thrown) {
            error.value = thrown as GetBytecodeErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, bytecode };
}
