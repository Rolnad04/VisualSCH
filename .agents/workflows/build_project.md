---
description: Build the Firebase Studio exported project
---

This workflow details the steps to install dependencies and build the project for production.

1. **Verify Environment**
   Ensure Node.js version is >= 20.
   ```bash
   node --version
   ```

2. **Install Dependencies**
   // turbo
   ```bash
   npm.cmd install
   ```

3. **Run Typecheck**
   // turbo
   ```bash
   npm.cmd run typecheck
   ```

4. **Build Project**
   // turbo
   ```bash
   npm.cmd run build
   ```
