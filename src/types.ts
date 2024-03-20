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
