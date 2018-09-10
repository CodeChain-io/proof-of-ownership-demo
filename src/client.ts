const RPCWebSocket = require("rpc-websockets").Client;

const publicKey =
    "d01e9f6fc4c8cc9c2354099f24a0cb4971255e6c82d508448ce5f82c852f0001caf74e313195e7ed6e152c120f59ef08ee8bdb1638c3e81d425ea58d51ca815b";
const assetTransactionHash =
    "5ee13fb7a069d2514be26be85977daf24c6f604202475778b6983104199df0f3";
const assetTransactionIndex = 0;
const serverURL = "ws://localhost:9009";

async function main() {
    let ws = await openSocket(serverURL);
    const result = await ws.call("startVerification", {
        publicKey,
        assetTransactionHash,
        transactionIndex: assetTransactionIndex
    });
    ws.close();

    // FIXME: need public key decryption.
    const { nonce, callback } = JSON.parse(result.message);
    ws = await openSocket(callback);
    const verificationResult = await ws.call("callback", {
        nonce
    });
    ws.close();

    console.log(
        `Verification result of Proof of Ownership is "${verificationResult}"`
    );
}

main().catch(console.error);

async function openSocket(url: string) {
    const ws = new RPCWebSocket(url);
    await waitUntilSocketOpen(ws);
    return ws;
}

function waitUntilSocketOpen(ws: any): Promise<void> {
    return new Promise(resolve => {
        ws.on("open", () => {
            resolve();
        });
    });
}
