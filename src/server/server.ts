const WebSocketServer = require("rpc-websockets").Server;
const option = require("config");

// instantiate Server and start listening for requests
const server = new WebSocketServer({
    port: option.port,
    host: option.host
});

server.register(
    "startVerification",
    ({
        publicKey,
        assetAddress
    }: {
        publicKey: string;
        assetAddress: string;
    }) => {
        // Get public key hash from CodeChain
        // Create a nonce
        // Encrypt the nonce
        const nonce = "0";
        const callback = `http://${option.host}:${option.port}/`;
        return {
            message: encrypt(JSON.stringify({ nonce, callback }), publicKey)
        };
    }
);

function encrypt(message: string, publicKey: string) {
    return message;
}

server.register("callback", (nonce: string) => {
    return true;
});
