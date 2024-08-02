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
exports.NftMarketplace = void 0;
const ton_core_1 = require("ton-core");
class NftMarketplace {
    constructor(ownerAddress) {
        this.ownerAddress = ownerAddress;
    }
    deploy(wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            const seqno = yield wallet.contract.getSeqno();
            yield wallet.contract.sendTransfer({
                seqno,
                secretKey: wallet.keyPair.secretKey,
                messages: [
                    (0, ton_core_1.internal)({
                        value: "1",
                        to: this.address,
                        init: this.stateInit,
                    }),
                ],
                sendMode: ton_core_1.SendMode.IGNORE_ERRORS + ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
            return seqno;
        });
    }
    get address() {
        return (0, ton_core_1.contractAddress)(0, this.stateInit);
    }
    get stateInit() {
        const code = this.createCodeCell();
        const data = this.createDataCell();
        return { code, data };
    }
    createDataCell() {
        const dataCell = (0, ton_core_1.beginCell)();
        dataCell.storeAddress(this.ownerAddress);
        return dataCell.endCell();
    }
    createCodeCell() {
        const NftMarketplaceCodeBoc = "te6cckEBBAEAbQABFP8A9KQT9LzyyAsBAgEgAgMAqtIyIccAkVvg0NMDAXGwkVvg+kDtRND6QDASxwXy4ZEB0x8BwAGOK/oAMAHU1DAh+QBwyMoHy//J0Hd0gBjIywXLAljPFlAE+gITy2vMzMlx+wCRW+IABPIwjvfM5w==";
        return ton_core_1.Cell.fromBase64(NftMarketplaceCodeBoc);
    }
}
exports.NftMarketplace = NftMarketplace;
//# sourceMappingURL=NftMarketplace.js.map