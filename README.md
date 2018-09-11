# PoO Demo

## Pre-requiesite

A CodeChain node with solo chain. // we use the solo's genesis address to pay for the fee.

## Setup

The setup script creates a public key, a private key and an asset.

```bash
yarn run-setup
```

## Run server

```bash
yarn run-server
```

## Run client

Change parameters in the `src/client.ts` file using the result of the setup script.

```bash
yarn run-client
```
