# Site Portfolio 

This repo is the [luisvalencia.dev](https://luisvalencia.dev/) website

## Development

### Setup

#### IDE

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

##### Type Support for `.vue` Imports in TS

If you're have errors in your `.vue` files, follow the steps in [Editor Setup](https://yarnpkg.com/getting-started/editor-sdks#editor-setup). This Vue setup doesn't play nice with Yarn's PnP strategy out of the box. See [Compatibility Issue](https://github.com/johnsoncodehk/volar/issues/918)

##### PnP Support 

This project uses PnP strategy, [ZipFS](https://marketplace.visualstudio.com/items?itemName=arcanis.vscode-zipfs) plugin should enable the `Go to Definition` behavior to work properly.

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

### Testing

#### Unit

##### Framework

This project uses [vitest](https://vitest.dev/) for authoring unit tests

##### Components

This project usses [vue test utils](https://test-utils.vuejs.org/) for testing Vue Components

##### Pinia

This project uses [the pinia test utils](https://pinia.vuejs.org/api/modules/pinia_testing.html) to aid in testing components
that use a pinia store.

To test a Pinia store check out [their cookbook](https://pinia.vuejs.org/cookbook/testing.html#unit-testing-a-store)


#### E2E

##### Framework

This project uses [Playwright](https://playwright.dev/docs/writing-tests) for authoring E2E tests

### Troubleshooting

#### Playwright

If you see an error that looks like this

```
    browserType.launch: Executable doesn't exist at /Users/lvalencia/Library/Caches/ms-playwright/chromium-1033/chrome-mac/Chromium.app/Contents/MacOS/Chromium
    ╔═════════════════════════════════════════════════════════════════════════╗
    ║ Looks like Playwright Test or Playwright was just installed or updated. ║
    ║ Please run the following command to download new browsers:              ║
    ║                                                                         ║
    ║     npx playwright install                                              ║
    ║                                                                         ║
    ║ <3 Playwright Team                                                      ║
    ╚═════════════════════════════════════════════════════════════════════════╝
```

It means the browsers Playwright uses to automate E2E testing are not installed on the machine. 
To install them, from the project root run:

```
yarn playwright install
```

You should be able to run the e2e tests now

#### Pinia Testing

If you see an error that looks like this

```
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Unhandled Errors ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

Vitest caught 2 unhandled errors during the test run.
This might cause false positive tests. Resolve unhandled errors to make sure your tests are not affected.

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Unhandled Rejection ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Error: Required unplugged package missing from disk. This may happen when switching branches without running installs (unplugged packages must be fully materialized on disk to work).

Missing package: vue-demi@virtual:70d7dd396b465e84f1a4121cf05708921da432ed22ede46efe5084d03f8432658e32d34be8dcf8dcc6a7860eabe46e620615ad3f5be3371df8459d4438b30201#npm:0.13.11
Expected package location: ./.yarn/unplugged/vue-demi-virtual-3d0746fbf4/node_modules/vue-demi/

```

It means the peer dependency for vue-demi isn't installed on the machine
To install it run:

```
 yarn add -D vue-demi
```

you should be able to run the unit tests now