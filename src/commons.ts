import { hasInjectionContext } from "vue";

export const WAGMI_CONFIG_KEY = Symbol();

export const ensureInjectionContext = () => {
  if (!hasInjectionContext()) {
    throw new Error(
      "Carrot Vue hooks can only be used inside functions that support injection context."
    );
  }
};
