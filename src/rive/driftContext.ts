import { createContext } from 'react';
import type { DriftAppearance } from './driftAppearance';

// Background actors share the stage's genre; explicit player snapshots win.
export const DriftContext = createContext<DriftAppearance | undefined>(undefined);
