import { defineComponent } from "vue";
import { createConfig, connect as wagmiConnect } from "@wagmi/core";
import { mock } from "@wagmi/connectors";
import { http } from "viem";
import { mount, type VueWrapper } from "@vue/test-utils";
import { arbitrumSepolia } from "viem/chains";
import { WAGMI_CONFIG_KEY } from "../src/commons";

export const DEFAULT_ACCOUNT_ADDRESSES = [
    "0x0000000000000000000000000000000000000001",
] as const;

const mockedConnector = mock({
    accounts: DEFAULT_ACCOUNT_ADDRESSES,
});

interface WithHostSetupParams<F extends (...args: any) => any> {
    composable: F;
    params?: Parameters<F>[0];
    connected?: boolean;
}

interface WithHostSetupReturnType<F extends (...args: any) => any> {
    wrapper: VueWrapper;
    result: ReturnType<F>;
}

export async function withHostSetup<F extends (...args: any) => any>({
    composable,
    params = {},
    connected,
}: WithHostSetupParams<F>): Promise<WithHostSetupReturnType<F>> {
    const wagmiConfig = createConfig({
        chains: [arbitrumSepolia],
        transports: {
            [arbitrumSepolia.id]: http(),
        },
        connectors: [mockedConnector],
    });

    if (connected)
        await wagmiConnect(wagmiConfig, { connector: mockedConnector });

    let result;
    const TestComponent = defineComponent({
        setup() {
            result = composable(params);
        },
        template: "<div></div>",
    });

    const wrapper = mount(TestComponent, {
        global: {
            provide: {
                [WAGMI_CONFIG_KEY]: wagmiConfig,
            },
        },
    });

    if (!result) throw new Error("composable result is undefined");

    return { result, wrapper };
}
