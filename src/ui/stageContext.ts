import { createContext, useContext } from 'react';
interface Runtime {
  playing: boolean;
  failed: ReadonlySet<string>;
  register: (id: string) => () => void;
}
export const StageContext = createContext<Runtime>({ playing: true, failed: new Set(), register: () => () => {} });
export const useStageRuntime = () => useContext(StageContext);
