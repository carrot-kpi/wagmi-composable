// import type { SupportedChain } from "@carrot-kpi/sdk";
// import { type Config as WagmiConfig } from "@wagmi/core";

// export type Config = WagmiConfig<
//     readonly [SupportedChain, ...SupportedChain[]]
// >;

export type Serializable<T> = T extends
  | string
  | number
  | boolean
  | null
  | undefined
  ? T
  : T extends object
    ? { [K in keyof T]: Serializable<T[K]> }
    : T extends Array<infer U>
      ? Array<Serializable<U>>
      : never;

export type SerializableObject<T extends object> = {
  [K in keyof T]: Serializable<T[K]>;
};
