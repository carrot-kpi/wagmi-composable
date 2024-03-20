import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
    type UnwrapRef,
} from "vue";
import {
    type GetPublicClientParameters,
    type GetPublicClientReturnType,
    type Config,
    getPublicClient,
    watchPublicClient,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export type UsePublicClientReturnType<
    config extends Config,
    chainId extends config["chains"][number]["id"] | number | undefined =
        | config["chains"][number]["id"]
        | undefined,
> = Ref<UnwrapRef<GetPublicClientReturnType<config, chainId>>>;

export function usePublicClient<
    config extends Config,
    chainId extends config["chains"][number]["id"] | number | undefined =
        | config["chains"][number]["id"]
        | undefined,
>(
    params?: MaybeRefOrGetter<GetPublicClientParameters<config, chainId>>,
): UsePublicClientReturnType<config, chainId> {
    const config = useWagmiConfig<config>();

    const publicClient = ref<GetPublicClientReturnType<config, chainId>>(
        getPublicClient(config, toValue(params)),
    );

    watchEffect((onCleanup) => {
        const unwatch = watchPublicClient(config, {
            onChange(newPublicClient) {
                publicClient.value = newPublicClient as UnwrapRef<
                    GetPublicClientReturnType<config, chainId>
                >;
            },
        });
        onCleanup(unwatch);
    });

    return publicClient;
}
