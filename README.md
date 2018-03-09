# Algolia Community website

This is the source code of https://community.algolia.com/. The deployment to this live website is automated
when changes are pushed to the `source` branch.

## Local setup

## Requirements

To run this project, you will need:

- Node.js >= 9.80, via nvm - [install instructions](https://github.com/creationix/nvm#install-script)
- Yarn >= 1.5.1 - [install instructions ("Alternatives" tab)](https://yarnpkg.com/en/docs/install): curl -o- -L https://yarnpkg.com/install.sh

Pro tip: Remove any brew installed/globall system installed Node.js and Yarn, just use nvm and Alternatives installation, they works perfectly.

Then:

```sh
nvm install
nvm use
```

## Dev

To develop on this project, do:

```shell
yarn
yarn dev
```

## Deploy

```shell
yarn build
yarn deploy
```

_You may encounter issues while running `yarn deploy`, you can fix it by following this [GH thread](https://github.com/shinnn/gulp-gh-pages/issues/116#issuecomment-364959382)_