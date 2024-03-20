import {
    ref,
    type Ref,
    type MaybeRefOrGetter,
    toValue,
    watchEffect,
} from "vue";
import {
    type GetEnsAvatarParameters,
    type GetEnsAvatarErrorType,
    type GetEnsAvatarReturnType,
    type Config,
    getEnsAvatar,
} from "@wagmi/core";
import { useWagmiConfig } from "./useWagmiConfig";

export interface UseEnsAvatarReturnType {
    loading: Ref<boolean>;
    error: Ref<GetEnsAvatarErrorType | undefined>;
    ensAvatar: Ref<GetEnsAvatarReturnType | undefined>;
}

export function useEnsAvatar<config extends Config>(
    params?: MaybeRefOrGetter<GetEnsAvatarParameters<config>>,
): UseEnsAvatarReturnType {
    const loading = ref(false);
    const error = ref<GetEnsAvatarErrorType | undefined>();
    const ensAvatar = ref<GetEnsAvatarReturnType | undefined>();

    const config = useWagmiConfig<config>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        ensAvatar.value = undefined;

        const newParams = toValue(params);
        if (!newParams) return;

        try {
            ensAvatar.value = await getEnsAvatar(config, newParams);
        } catch (thrown) {
            error.value = thrown as GetEnsAvatarErrorType;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, ensAvatar };
}
