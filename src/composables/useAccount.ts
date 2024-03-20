import { ref, type Ref, watchEffect, type UnwrapRef } from "vue";
import {
    type GetAccountReturnType,
    getAccount,
    watchAccount,
    type Config,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export type UseAccountReturnType<config extends Config> = Ref<
    UnwrapRef<GetAccountReturnType<config>>
>;

export function useAccount<
    config extends Config,
>(): UseAccountReturnType<config> {
    const config = useWagmiConfig<config>();
    const account = ref<GetAccountReturnType<config>>(getAccount(config));

    watchEffect((onCleanup) => {
        const unwatch = watchAccount(config, {
            onChange(newAccount) {
                account.value = newAccount as UnwrapRef<
                    GetAccountReturnType<config>
                >;
            },
        });
        onCleanup(unwatch);
    });

    return account;
}
