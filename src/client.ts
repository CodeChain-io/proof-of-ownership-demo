import { decrypt } from "./crypto";

const RPCWebSocket = require("rpc-websockets").Client;

const publicKey =
    "08b87b1a5919fbe9c0b83b74a3ce941b3d83ab9ae33f6cc8a41098846d01dfb6a091257dfed1980c00aa3f9405b0dee13fa0bb8f876cc1d3ee8101358994a4b2";
const privateKey =
    "673909919aeca9e76196d81083fba9adc95d9cb2ba461b5b43c4785d0de54ecc";
const assetTransactionHash =
    "8a04c0ecd473e507bc425cc29d77f7bd7f3a403bb2816e79e2c620a7c7d17228";
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

    console.log(`message = ${result.message}\n`);

    const decryptedMessage = await decrypt(result.message, privateKey);
    console.log(`decryptedMessage = ${decryptedMessage}\n`);

    const { nonce, callback } = JSON.parse(decryptedMessage);
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
