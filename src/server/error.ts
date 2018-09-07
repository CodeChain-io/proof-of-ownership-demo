export enum ErrorCode {
    AssetNotFound,
    PublicKeyMisedMatch
}

export class PoOErrormError extends Error {
    constructor(public code: ErrorCode, message?: string) {
        super(message); // 'Error' breaks prototype chain here
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }

    public toJSONRPCError() {
        return {
            code: this.code,
            message: `${ErrorCode[this.code]} ${this.message}`
        };
    }
}
