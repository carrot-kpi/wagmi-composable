import {
    ref,
    type MaybeRefOrGetter,
    watchEffect,
    toValue,
    type Ref,
    type UnwrapRef,
} from "vue";
import {
    type GetClientParameters,
    type GetClientReturnType,
    type Config,
    getClient,
    watchClient,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export type UseClientReturnType<
    config extends Config,
    chainId extends config["chains"][number]["id"] | number | undefined =
        | config["chains"][number]["id"]
        | undefined,
> = Ref<UnwrapRef<GetClientReturnType<config, chainId>>>;

export function useClient<
    config extends Config,
    chainId extends config["chains"][number]["id"] | number | undefined =
        | config["chains"][number]["id"]
        | undefined,
>(
    params?: MaybeRefOrGetter<GetClientParameters<config, chainId>>,
): UseClientReturnType<config, chainId> {
    const config = useWagmiConfig<config>();
    const client = ref<GetClientReturnType<config, chainId>>(
        getClient(config, toValue(params)),
    );

    watchEffect((onCleanup) => {
        const unwatch = watchClient(config, {
            onChange(newClient) {
                client.value = newClient as UnwrapRef<
                    GetClientReturnType<config, chainId>
                >;
            },
        });
        onCleanup(unwatch);
    });

    return client;
}
