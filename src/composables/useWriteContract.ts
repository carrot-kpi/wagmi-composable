import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type WriteContractParameters,
    type WriteContractErrorType,
    type WriteContractReturnType,
    type Config,
    writeContract,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";
import type { Abi, ContractFunctionArgs, ContractFunctionName } from "viem";

export interface UseWriteContractReturnType {
    loading: Ref<boolean>;
    error: Ref<WriteContractErrorType | undefined>;
    hash: Ref<WriteContractReturnType | undefined>;
}

export function useWriteContract<
    const abi extends Abi | readonly unknown[],
    functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
    args extends ContractFunctionArgs<
        abi,
        "nonpayable" | "payable",
        functionName
    >,
    config extends Config,
>(
    params?: MaybeRefOrGetter<
        WriteContractParameters<abi, functionName, args, config>
    >,
): UseWriteContractReturnType {
    const loading = ref(false);
    const error = ref<WriteContractErrorType | undefined>();
    const hash = ref<WriteContractReturnType | undefined>();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        hash.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            hash.value = await writeContract(config, newParams);
        } catch (thrown) {
            error.value = thrown as WriteContractErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, hash };
}
