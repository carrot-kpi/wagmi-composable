import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type SimulateContractParameters,
    type SimulateContractErrorType,
    type SimulateContractReturnType,
    type Config,
    simulateContract,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";
import type { Abi, ContractFunctionArgs, ContractFunctionName } from "viem";

export interface UseSimulateContractReturnType<
    abi extends Abi | readonly unknown[] = Abi,
    functionName extends ContractFunctionName<
        abi,
        "nonpayable" | "payable"
    > = ContractFunctionName<abi, "nonpayable" | "payable">,
    args extends ContractFunctionArgs<
        abi,
        "nonpayable" | "payable",
        functionName
    > = ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>,
    config extends Config = Config,
    chainId extends config["chains"][number]["id"] | undefined = undefined,
> {
    loading: Ref<boolean>;
    error: Ref<SimulateContractErrorType | undefined>;
    simulation: Ref<
        | SimulateContractReturnType<abi, functionName, args, config, chainId>
        | undefined
    >;
}

export function useSimulateContract<
    const abi extends Abi | readonly unknown[],
    functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
    args extends ContractFunctionArgs<
        abi,
        "nonpayable" | "payable",
        functionName
    >,
    config extends Config,
    chainId extends config["chains"][number]["id"] | undefined = undefined,
>(
    params?: MaybeRefOrGetter<
        SimulateContractParameters<abi, functionName, args, config, chainId>
    >,
): UseSimulateContractReturnType<abi, functionName, args, config, chainId> {
    const loading = ref(false);
    const error = ref<SimulateContractErrorType | undefined>();
    const simulation = ref<
        | SimulateContractReturnType<abi, functionName, args, config, chainId>
        | undefined
    >();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        simulation.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            simulation.value = await simulateContract(config, newParams);
        } catch (thrown) {
            error.value = thrown as SimulateContractErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, simulation };
}
