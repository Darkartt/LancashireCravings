This folder contains 10 unified-diff patch files. Apply with:

- Inspect a patch: git apply --check fixes/NN-name.patch
- Apply a patch: git apply fixes/NN-name.patch

Patches
1) 01-ci-scripts-and-lighthouse.patch
   - Adds test scripts and lighthouse script + @lhci/cli devDependency in package.json.
2) 02-robots-json-unblock.patch
   - Removes blanket JSON disallow, explicitly allows manifest files.
3) 03-sitemap-include-dynamic.patch
   - Includes dynamic project/shop URLs in sitemap.
4) 04-consolidate-next-config.patch
   - Merges analyzer/experimental into next.config.mjs.
5) 05-optimizedimage-lcp-hints.patch
   - Adds fetchPriority/decoding to OptimizedImage for better LCP.
6) 06-qa-node-version-20.patch
   - Sets QA workflow Node to v20.
7) 07-add-nvmrc-and-engines.patch
   - Adds .nvmrc=20. (Add engines manually if desired.)
8) 08-csp-meta-fallback.patch
   - Adds CSP meta fallback in layout for GH Pages.
9) 09-deploy-workflow-consistency.patch
   - Runs export and uploads ./out in deploy-gh-pages workflow.
10) 10-remove-next-config-ts.patch
   - Deletes next.config.ts (after consolidating into .mjs).
