# Description

This project brings an easy to use graphical interface to interact with Dexter smart contracts.

It could be useful as a starting point to build arbitrage bots, multiple steps workflows that interact with Tezos blockchain, etc.

# Prerequisites

- Installed NodeJS (tested with NodeJS v14+)

- Installed NPM

# Quick start

`npm install -g --unsafe-perm node-red`

check other options (it can run in a docker container for example), [here](https://nodered.org/docs/getting-started/)

# Adding Dexter nodes to node-red:

Go to the node-red data directory e.g: ~/.node-red and run:

`cd ~/.node-red`

`npm install --save node-red-contrib-tezos-utils`

Then restart node-red.

# Usage

[Youtube video]() - Comming soon.

# Security

Some components requires a Tezos wallet in order to sign transaction on the blockchain, the secret key is saved encripted with a default private key in node-red storage, please be aware that this setup can compromise your funds, security measures must be taken in consideration.

FOR EDUCATION PURPOSES ONLY, USE AT YOUR OWN RISK
