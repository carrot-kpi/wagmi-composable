import { describe, test, expect } from "vitest";
import { DEFAULT_ACCOUNT_ADDRESSES, withHostSetup } from "../../utils";
import { useAccount } from "../../../src/composables/wagmi/useAccount";

describe("Composables", () => {
    describe("Wagmi", () => {
        describe("useAccount", () => {
            test("It should work when disconnected", async () => {
                const { result } = await withHostSetup({
                    composable: useAccount,
                });
                expect(result.value).to.not.be.undefined;
                expect(result.value?.address).to.be.undefined;
            });

            test("It should work when connected", async () => {
                const { result } = await withHostSetup({
                    composable: useAccount,
                    connected: true,
                });
                expect(result.value).to.not.be.undefined;
                expect(result.value?.address).to.be.eq(
                    DEFAULT_ACCOUNT_ADDRESSES[0],
                );
            });
        });
    });
});
