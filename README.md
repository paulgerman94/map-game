# map-game
[![Build Status](https://travis-ci.org/kdex/map-game.svg?branch=master)](https://travis-ci.org/kdex/map-game)
[![Documentation coverage](https://doc.esdoc.org/github.com/kdex/map-game/badge.svg)](https://doc.esdoc.org/github.com/kdex/map-game/)
## Dependencies
```bash
$ npm install -g gulpjs/gulp.git#4.0 jspm@beta bower
```
## Installation
```bash
# Install all web assets
$ bower install
# Install all node dependencies
$ npm install
# Install all web dependencies
$ jspm install
# Transpile, bundle, start game server
$ gulp
```
## Documentation
The official documentation can be found [here](https://doc.esdoc.org/github.com/kdex/map-game/).
## Requirement ideas
- Should work in the forest; i. e. the users should be able to have no service

## Game ideas
- Delivering parcels to NPCs that are located at certain GPS locations
	- If the character is hungry, the player needs to go to a supermarket to buy food
	- Real-life RPG
	- Armor that suits the company's produce in your vicinity
	- Generate monsters that you have to defeat on your way
- Territory-based expansion game
- Run to a certain location in a given time
- Customize player's schedule into game
- Implement the feature to extract something like "nearby schools"
- Gaining points per time unit for controlling certain points
- Capture the flag with strangers
	- Time constraints
	- Teams
	- Area constraints
	- Party size constraints
	- Random team assignment on registration
	- POI are flag locations
	- Visiting POIs on the way can buff the player
	- Run away in combat; flags spawn somewhere else where the player has to go
	- If player collects all flags of certain category ⇒ Bonus!
	- Player headquarters (schools? home?)
	- Items (Sling, shield, …)
	- Human flags?
