import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type ReadContractsParameters,
    type ReadContractsErrorType,
    type ReadContractsReturnType,
    type Config,
    readContracts,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";
import type { ContractFunctionParameters } from "viem";

export interface UseReadContractsReturnType<
    contracts extends
        readonly ContractFunctionParameters[] = ContractFunctionParameters[],
    allowFailure extends boolean = true,
> {
    loading: Ref<boolean>;
    error: Ref<ReadContractsErrorType | undefined>;
    data: Ref<ReadContractsReturnType<contracts, allowFailure> | undefined>;
}

export function useReadContracts<
    contracts extends
        readonly ContractFunctionParameters[] = ContractFunctionParameters[],
    allowFailure extends boolean = true,
    config extends Config = Config,
>(
    params?: MaybeRefOrGetter<
        ReadContractsParameters<contracts, allowFailure, config>
    >,
): UseReadContractsReturnType<contracts, allowFailure> {
    const loading = ref(false);
    const error = ref<ReadContractsErrorType | undefined>();
    const data = ref<
        ReadContractsReturnType<contracts, allowFailure> | undefined
    >();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        data.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            data.value = await readContracts(config, newParams);
        } catch (thrown) {
            error.value = thrown as ReadContractsErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, data };
}
