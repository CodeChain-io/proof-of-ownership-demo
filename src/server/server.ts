import { SDK } from "codechain-sdk";
import { blake256 } from "codechain-sdk/lib/utils";

import { encrypt } from "../crypto";
import * as codechain from "./codechain";
import * as db from "./db";
import { ErrorCode, PoOErrormError } from "./error";

const WebSocketServer = require("rpc-websockets").Server;
const option = require("config");
const sdk = new SDK({ server: option.codechainRPCURL });

// instantiate Server and start listening for requests
const server = new WebSocketServer({
    port: option.port,
    host: option.host
});

server.register(
    "startVerification",
    async ({
        publicKey,
        assetTransactionHash,
        transactionIndex
    }: {
        publicKey: string;
        assetTransactionHash: string;
        transactionIndex: number;
    }) => {
        try {
            const pkh = await codechain.getPKH({
                sdk,
                assetTransactionHash,
                transactionIndex
            });
            if (blake256(publicKey) !== pkh) {
                throw new PoOErrormError(
                    ErrorCode.PublicKeyMisedMatch,
                    `publicKey: ${publicKey} -> ${blake256(
                        publicKey
                    )} pkh: ${pkh}`
                );
            }

            const nonce = getRandomNonce();
            await db.save(nonce);
            const callback = `http://${option.host}:${option.port}/`;
            return {
                message: await encrypt(
                    JSON.stringify({ nonce, callback }),
                    publicKey
                )
            };
        } catch (err) {
            if (err.toJSONRPCError) {
                throw err.toJSONRPCError();
            } else {
                throw err;
            }
        }
    }
);

function getRandomNonce() {
    return String(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
}

server.register("callback", async ({ nonce }: { nonce: string }) => {
    if (await db.exist(nonce)) {
        await db.remove(nonce);
        return true;
    }

    return false;
});
