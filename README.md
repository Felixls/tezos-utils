# Description

This project brings an easy to use graphical interface to interact with Dexter smart contracts.

It could be useful as a starting point to build arbitrage bots, multiple steps workflows that interact with Tezos blockchain, etc.

# Project structure

```
.
|── dexter/       # Dexter & Tezos utilities
└── tezos-utils/  # Tezos Node-red nodes
```

# Prerequisites

- Installed NodeJS (tested with NodeJS v14+)

- Installed NPM

# Quick start

`npm install -g --unsafe-perm node-red`

check other options (it can run in a docker container for example), [here](https://nodered.org/docs/getting-started/)

# Building node-red nodes

Download this repo and execute:

`cd dexter`

`npm install`

`npm run build`

`cd ../dexter-utils`

`npm install`

# Adding Dexter nodes to node-red:

Go to the node-red data directory e.g: ~/.node-red and run:

`cd ~/.node-red`

`npm install {path to tezos-utils directory}`

`node-red`

# Usage

[Youtube video]()

# Security

Some components requires a Tezos wallet in order to sign transaction on the blockchain, the secret key is saved encripted with a default private key in node-red storage, please be aware that this setup can compromise your funds, security measures must be taken in consideration.

FOR EDUCATION PURPOSES ONLY, USE AT YOUR OWN RISK
