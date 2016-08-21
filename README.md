<p align="center">
  <img src="https://github.com/kdex/map-game/blob/master/img/logo-192.png?raw=true">
</p>
[![Build Status](https://travis-ci.org/kdex/map-game.svg?branch=master)](https://travis-ci.org/kdex/map-game)
[![Documentation coverage](https://doc.esdoc.org/github.com/kdex/map-game/badge.svg)](https://doc.esdoc.org/github.com/kdex/map-game/)
[![Coverage Status](https://coveralls.io/repos/github/kdex/map-game/badge.svg?branch=master)](https://coveralls.io/github/kdex/map-game?branch=master)
## Installation
### Preliminaries
For this guide, we assume that you already have a proper developing environment set up. Internally, this project uses `bcrypt` for its security, which is why a C++ compiler that requires the **C++ 11** standard has to be installed for it to compile. If your default C++ compiler does not support C++ 11, please set your `CXX` environment variable accordingly.

Further, this project uses **PostgreSQL** as its database. Make sure you have at least version 9.4 installed. Since this project makes extensive use of geospatial data, you will also need to install the **PostGIS** extensions for PostgreSQL.

You do not need to create a database nor users. The defaults will work; if you wish to have a custom database configuration, please configure `config.json` accordingly before installing the project. Note that this file is not only needed for installation, but also on runtime. Do not delete any files.

Note that this project is mainly built in JavaScript; both the client and the server are made with JavaScript. Hence, we expect you already have a working **NodeJS** environment set up.
### Dependencies
This project uses `gulp` as its task runner, `jspm` for shipping SystemJS modules to browsers and `bower` for some CSS dependencies. You can install all of these tools with:
```bash
$ npm install -g gulpjs/gulp.git#4.0 jspm@beta bower
```
Once you have these tools installed, you can start building the project. First, you need to install all web assets from `bower`:
```bash
$ bower install
```
Next, you can install the node dependencies that the projects needs in total. These dependencies are only needed for the server side.
```bash
$ npm install
```
Then, you will have to install the client dependencies. Since SystemJS implements ECMAScript 2015 modules, we do not use CommonJS or RequireJS in this project, but instead transform all modules with `jspm`. This choice was made so that in the future, `jspm` can eventually be dropped once all client dependencies perform standards-compliant module exposure.
```bash
$ jspm install
```
Lastly, you will need to transpile the game to a set of languages that browsers nowadays understand. The ECMAScript (or ESNext) code will be transpiled to ES5 JavaScript while the PostCSS will be transformed to regular CSS. After transpiling the game, it's important to bundle the dependencies.

The process of bundling consists of concatenating and minifying most of the files that the client will download before it can initialize. The smaller this initial payload is, the faster it can load. Impending technologies such as **HTTP/2** will eventually deprecate bundles (at least it's likely that single-file bundles won't exist in the near future), which is why this project is thoroughly tested against an `nginx` webserver with **HTTP/2** enabled.

The reasoning behind the choice that this project caches the resulting bundle is that the caching API can be simplified. We still benefit a lot from HTTP/2, since all other requests are carried out over it.

The gulp default task is to transpile and bundle the project and then run the server transpilation afterwards:
```bash
$ gulp
```
## Running the game
The game can run on desktop machines and phones. Since Firefox's Permission and GeoLocation API is a little broken, we recommend actual browsers such as Chromium.

Note that this game requires at least Chromium 52, as some ECMAScript Next features can not be expressed in older language standards such a ES5. One "untranspilable" example would be ECMAScript 2015 Proxies, which both the client and the server use.
## Documentation
If you're interested in how the internals of this project work, you can check out the official documentation which can be found [here](https://doc.esdoc.org/github.com/kdex/map-game/).
