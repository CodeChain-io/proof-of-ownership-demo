import { SDK } from "codechain-sdk";
import { ErrorCode, PoOError } from "./error";

export async function getPKH(params: {
    sdk: SDK;
    assetTransactionHash: string;
    transactionIndex: number;
}): Promise<string> {
    const { sdk, assetTransactionHash, transactionIndex } = params;
    const asset = await sdk.rpc.chain.getAsset(
        assetTransactionHash,
        transactionIndex
    );

    if (asset === null) {
        throw new PoOError(ErrorCode.AssetNotFound);
    }

    return Buffer.from(asset.parameters[0]).toString("hex");
}
