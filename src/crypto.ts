const eccrypto = require("eccrypto");
import { Buffer } from "buffer";

export async function encrypt(
    message: string,
    publicKey: string
): Promise<string> {
    const { iv, ephemPublicKey, ciphertext, mac } = await eccrypto.encrypt(
        Buffer.from("04" + publicKey, "hex"),
        Buffer.from(message)
    );
    return JSON.stringify({
        iv: iv.toString("hex"),
        ephemPublicKey: ephemPublicKey.toString("hex"),
        ciphertext: ciphertext.toString("hex"),
        mac: mac.toString("hex")
    });
}

export async function decrypt(
    encryptedMessage: string,
    privateKey: string
): Promise<string> {
    const encryptedObject = JSON.parse(encryptedMessage);
    const { iv, ephemPublicKey, ciphertext, mac } = encryptedObject;
    const buffer = await eccrypto.decrypt(Buffer.from(privateKey, "hex"), {
        iv: Buffer.from(iv, "hex"),
        ephemPublicKey: Buffer.from(ephemPublicKey, "hex"),
        ciphertext: Buffer.from(ciphertext, "hex"),
        mac: Buffer.from(mac, "hex")
    });
    return buffer.toString();
}
