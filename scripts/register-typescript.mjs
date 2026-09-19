// Run engine tests against source without adding a bundler/test dependency.
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

registerHooks({
  resolve(specifier, context, nextResolve) {
    try { return nextResolve(specifier, context); }
    catch (error) {
      if (!specifier.startsWith('.')) throw error;
      for (const suffix of ['.ts', '/index.ts']) {
        try { return nextResolve(specifier + suffix, context); } catch { /* Try next candidate. */ }
      }
      throw error;
    }
  },
  load(url, context, nextLoad) {
    if (!url.endsWith('.ts')) return nextLoad(url, context);
    const source = ts.transpileModule(readFileSync(new URL(url), 'utf8'), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    }).outputText;
    return { format: 'module', source, shortCircuit: true };
  },
});
