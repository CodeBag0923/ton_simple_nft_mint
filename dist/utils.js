"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openWallet = openWallet;
const ton_crypto_1 = require("ton-crypto");
const ton_1 = require("ton");
function openWallet(mnemonic, testnet) {
    return __awaiter(this, void 0, void 0, function* () {
        const keyPair = yield (0, ton_crypto_1.mnemonicToPrivateKey)(mnemonic);
        const toncenterBaseEndpoiint = testnet ? "https://testnet.toncenter.com" : "https://toncenter.com";
        const client = new ton_1.TonClient({
            endpoint: `${toncenterBaseEndpoiint}/api/v2/jsonRPC`,
            apiKey: process.env.TONCENTER_API_KEY
        });
        const wallet = ton_1.WalletContractV4.create({
            workchain: 0,
            publicKey: keyPair.publicKey
        });
        const contract = client.open(wallet);
        return { contract, keyPair };
    });
}
//# sourceMappingURL=utils.js.map