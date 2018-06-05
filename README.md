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

The deploy steps are directly handled by Gulp.js in the gulpfile.

```shell
yarn build
yarn deploy
```

## Updating the underlying index

The current `appId` storing the data is `HXQH62TCI4`.
If you want to update the data, first test it on a new index, modify `algolia-projects.json` then `config.json` and run:

```sh
yarn update-index
```

Once you are sure this is the right config, you can update `config.json` to point it to the right production index.

_You may encounter issues while running `yarn deploy`, you can fix it by following this [GH thread](https://github.com/shinnn/gulp-gh-pages/issues/116#issuecomment-364959382)_