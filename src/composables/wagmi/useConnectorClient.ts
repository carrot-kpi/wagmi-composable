import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type GetConnectorClientParameters,
    type GetConnectorClientErrorType,
    type GetConnectorClientReturnType,
    type Config,
    getConnectorClient,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseConnectorClientReturnType<config extends Config> {
    loading: Ref<boolean>;
    error: Ref<GetConnectorClientErrorType | undefined>;
    connectorClient: Ref<GetConnectorClientReturnType<config> | undefined>;
}

export function useConnectorClient<config extends Config>(
    params?: MaybeRefOrGetter<GetConnectorClientParameters<config>>,
): UseConnectorClientReturnType<config> {
    const loading = ref(false);
    const error = ref<GetConnectorClientErrorType | undefined>();
    const connectorClient = ref<
        GetConnectorClientReturnType<config> | undefined
    >();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        connectorClient.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            connectorClient.value = await getConnectorClient(config, newParams);
        } catch (thrown) {
            error.value = thrown as GetConnectorClientErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, connectorClient };
}
