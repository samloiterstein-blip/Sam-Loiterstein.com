import { createContext, useContext } from "react";

export const SdrDenseContext = createContext(false);

export function useSdrDense() {
  return useContext(SdrDenseContext);
}
