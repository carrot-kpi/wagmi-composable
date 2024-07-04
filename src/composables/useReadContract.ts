import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type ReadContractParameters,
    type ReadContractErrorType,
    type ReadContractReturnType,
    type Config,
    readContract,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";
import type { Abi, ContractFunctionArgs, ContractFunctionName } from "viem";

export interface UseReadContractReturnType<
    abi extends Abi | readonly unknown[],
    functionName extends ContractFunctionName<abi, "pure" | "view">,
    args extends ContractFunctionArgs<abi, "pure" | "view", functionName>,
> {
    loading: Ref<boolean>;
    error: Ref<ReadContractErrorType | undefined>;
    data: Ref<ReadContractReturnType<abi, functionName, args> | undefined>;
}

export function useReadContract<
    const abi extends Abi | readonly unknown[],
    functionName extends ContractFunctionName<abi, "pure" | "view">,
    args extends ContractFunctionArgs<abi, "pure" | "view", functionName>,
    config extends Config,
>(
    params?: MaybeRefOrGetter<
        ReadContractParameters<abi, functionName, args, config>
    >,
): UseReadContractReturnType<abi, functionName, args> {
    const loading = ref(false);
    const error = ref<ReadContractErrorType | undefined>();
    const data = ref<
        ReadContractReturnType<abi, functionName, args> | undefined
    >();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        data.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            // FIXME: remove cast to ReadContractParameters
            data.value = await readContract(
                config,
                newParams as ReadContractParameters<
                    abi,
                    functionName,
                    args,
                    config
                >,
            );
        } catch (thrown) {
            error.value = thrown as ReadContractErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, data };
}
