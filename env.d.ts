/// <reference types="vite/client" />

import type { Config } from "./src/types";

declare module "@wagmi/core" {
    interface Register {
        config: Config;
    }
}
