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
