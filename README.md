# Luis Valencia Site Portfolio

This repo is the luisvalencia.dev website

## Development

### Setup

#### IDE

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

##### Type Support for `.vue` Imports in TS

If you're have errors in your `.vue` files, follow the steps in [Editor Setup](https://yarnpkg.com/getting-started/editor-sdks#editor-setup). This Vue setup doesn't play nice with Yarn's PnP strategy out of the box. See [Compatibility Issue](https://github.com/johnsoncodehk/volar/issues/918)

##### Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

### Running

#### (Optional) Install

This codebase uses a [PnP](https://yarnpkg.com/features/pnp) strategy, you shouldn't need to run this step, but if you find that you do.

```sh
yarn install
```

#### Compile and Hot-Reload for Development

```sh
yarn dev
```

#### Type-Check, Compile and Minify for Production

```sh
yarn build
```

#### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
yarn test:unit
```

#### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
yarn playwright install

# When testing on CI, must build the project first
yarn build

# Runs the end-to-end tests
yarn test:e2e
# Runs the tests only on Chromium
yarn test:e2e -- --project=chromium
# Runs the tests of a specific file
yarn test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
yarn test:e2e -- --debug

# Open teh last report
yarn playwright show-report
```

#### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```
