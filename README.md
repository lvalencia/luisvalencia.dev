# LuisValencia.Dev 

This repo is the monorepo for [luisvalencia.dev](https://luisvalencia.dev/) website

**Note**: The site is currently being developed. It's an exercise in experimenting with Vue + Vite

# Packages

The following packages comprise this repo

## @luvle/luisvalencia.dev

The [luisvalencia.dev](https://luisvalencia.dev/) website

## @luvle/code-deploy

The deployment module that pushes a built vite site AWS. Default deploymenet target is `@luvle/luisvalencia.dev`

## @luvle/utils

The utils module that houses shared common utils across packages

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

e.g. the following

```
packageExtensions:
  "local-pkg@*":
    dependencies:
      "jsdom": "*"
```

would resolve the problem seen above.

**Note**: You would need to re-run `yarn install` prior to running the command that caused the issue.