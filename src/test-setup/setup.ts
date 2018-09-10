import { SDK } from "codechain-sdk";
import { getPublicFromPrivate } from "codechain-sdk/lib/utils";

const option = require("config");
const sdk = new SDK({ server: option.codechainRPCURL });

(async () => {
    await importAccount();

    const keyStore = await sdk.key.createLocalKeyStore();
    const p2pkh = await sdk.key.createP2PKH({ keyStore });

    const address = await p2pkh.createAddress();
    const assetAccountPKH = address.payload.value;
    const assetAccountPrivateKey = await keyStore.asset.exportRawKey({
        key: assetAccountPKH
    });
    const assetAccountPublicKey = await keyStore.asset.getPublicKey({
        key: assetAccountPKH
    });

    console.assert(
        getPublicFromPrivate(assetAccountPrivateKey) === assetAccountPublicKey
    );

    // Create asset named Gold. Total amount of Gold is 10000. The registrar is set
    // to null, which means this type of asset can be transferred freely.
    const assetScheme = sdk.core.createAssetScheme({
        shardId: 0,
        worldId: 0,
        metadata: JSON.stringify({
            name: "PoOTestAsset",
            description: "This asset is used to test PoO",
            icon_url: "https://gold.image/"
        }),
        amount: 10000
    });
    const mintTx = sdk.core.createAssetMintTransaction({
        scheme: assetScheme,
        recipient: address
    });

    const parcel = sdk.core.createAssetTransactionGroupParcel({
        transactions: [mintTx]
    });
    await sdk.rpc.chain.sendParcel(parcel, {
        account: "tccqzn9jjm3j6qg69smd7cn0eup4w7z2yu9my9a2k78",
        passphrase: "satoshi"
    });

    const mintTxInvoice = await sdk.rpc.chain.getTransactionInvoice(
        mintTx.hash(),
        {
            timeout: 300 * 1000
        }
    );
    if (mintTxInvoice === null || mintTxInvoice.success === false) {
        throw Error("AssetMintTransaction failed");
    }

    console.log(
        JSON.stringify({
            publicKey: assetAccountPublicKey,
            privateKey: assetAccountPrivateKey,
            publicKeyHash: assetAccountPKH,
            assetTransactionHash: mintTx.hash().value,
            transactionIndex: 0
        })
    );
})().catch(err => {
    console.error(`Error:`, err);
});

async function importAccount(): Promise<void> {
    try {
        const secret =
            "ede1d4ccb4ec9a8bbbae9a13db3f4a7b56ea04189be86ac3a6a439d9a0a1addd";
        const passphrase = "satoshi";
        await sdk.rpc.account.importRaw(secret, passphrase);
    } catch (err) {
        if (err.code === -32042) {
            console.error("Already imported");
            return;
        }
        throw err;
    }
}
