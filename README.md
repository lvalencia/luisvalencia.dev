# LuisValencia.Dev 

[LuisValencia.Dev](https://luisvalencia.dev/) is my personal developer website. 

# Packages

The following packages comprise this repo

## @luvle/luisvalencia.dev

The vite vue [luisvalencia.dev](https://luisvalencia.dev/) website

## @luvle/code-deploy

The deployment module that pushes a built vite site AWS. Default deployment target is `@luvle/luisvalencia.dev`

## @luvle/utils

The utils module that houses shared common utility functions and abstractions across packages

# Development

The aim of this codebase is to offer the flexibility of having all the code relating to the site collocated in one place, while allowing for the 
ability to create strong boundaries and clear responsibitlies in the code via modules.

For this reason, this codebase in structured as a monorepo and uses [yarn workspaces](https://yarnpkg.com/features/workspaces#gatsby-focus-wrapper) to manage all its packages.

Additionally, this codebase uses a [Plug and Play (pnp)](https://yarnpkg.com/features/pnp) strategy for its dependencies. Materially, this simply means that to start
developing you just pull the codebase and start working in the package that you need to modify. No need to run `yarn install` because the dependencies are packaged 
with the codebase.

**Note**: This repo requires a minimum version of Node 24 LTS.

To start developing in a particular package, read the package's README.md.

# Release

To build and release this site run the following command:

```sh
yarn release
```

This will run the release scripts for `@luvle/utils` and `@luvle/luisvalencia.dev` sequentually and run `@luvle/code-deploy` to deploy the site.
The release scripts for each package will in the very least build and test the package to validate its functinoality.

# Toubleshooting 

## @luvle/luisvalencia.dev

If you see an that looks like this

```
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Unhandled Error ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Error: local-pkg tried to access jsdom, but it isn't declared in its dependencies; this makes the require call ambiguous and unsound.

Required package: jsdom (via "jsdom/package.json")
Required by: local-pkg@npm:0.4.3 (via .yarn/cache/local-pkg-npm-0.4.3-de61dda1fd-7825aca531.zip/node_modules/local-pkg/index.mjs)
```

It's a problem with how yarn is resolving the dependency at the top level when in PnP mode.
This can be resolved by [declaring the resoltuion in the .yarnrc.yml](https://github.com/styled-components/styled-components/issues/3082#issuecomment-606641463).

e.g. the following would resolve the problem seen above:

```
packageExtensions:
  "local-pkg@*":
    dependencies:
      "jsdom": "*"
```

**Note**: You would need to re-run `yarn install` prior to running the command that caused the issue.
