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
exports.NftSale = void 0;
const ton_core_1 = require("ton-core");
class NftSale {
    constructor(data) {
        this.data = data;
    }
    deploy(wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            const stateInit = (0, ton_core_1.beginCell)()
                .store((0, ton_core_1.storeStateInit)(this.stateInit))
                .endCell();
            const payload = (0, ton_core_1.beginCell)();
            payload.storeUint(1, 32);
            payload.storeCoins((0, ton_core_1.toNano)("0.05"));
            payload.storeRef(stateInit);
            payload.storeRef(new ton_core_1.Cell());
            const seqno = yield wallet.contract.getSeqno();
            yield wallet.contract.sendTransfer({
                seqno,
                secretKey: wallet.keyPair.secretKey,
                messages: [
                    (0, ton_core_1.internal)({
                        value: "0.05",
                        to: this.data.marketplaceAddress,
                        body: payload.endCell(),
                    }),
                ],
                sendMode: ton_core_1.SendMode.IGNORE_ERRORS + ton_core_1.SendMode.PAY_GAS_SEPARATELY,
            });
            return seqno;
        });
    }
    createDataCell() {
        const saleData = this.data;
        const feesCell = (0, ton_core_1.beginCell)();
        feesCell.storeAddress(saleData.marketplaceFeeAddress);
        feesCell.storeCoins(saleData.marketplaceFee);
        feesCell.storeAddress(saleData.royaltyAddress);
        feesCell.storeCoins(saleData.royaltyAmount);
        const dataCell = (0, ton_core_1.beginCell)();
        dataCell.storeUint(saleData.isComplete ? 1 : 0, 1);
        dataCell.storeUint(saleData.createdAt, 32);
        dataCell.storeAddress(saleData.marketplaceAddress);
        dataCell.storeAddress(saleData.nftAddress);
        dataCell.storeAddress(null);
        dataCell.storeCoins(saleData.fullPrice);
        dataCell.storeRef(feesCell.endCell());
        return dataCell.endCell();
    }
    get address() {
        return (0, ton_core_1.contractAddress)(0, this.stateInit);
    }
    get stateInit() {
        const code = this.createCodeCell();
        const data = this.createDataCell();
        return { code, data };
    }
    createCodeCell() {
        const NftFixPriceSaleV2CodeBoc = "te6cckECDAEAAikAART/APSkE/S88sgLAQIBIAMCAATyMAIBSAUEAFGgOFnaiaGmAaY/9IH0gfSB9AGoYaH0gfQB9IH0AGEEIIySsKAVgAKrAQICzQgGAfdmCEDuaygBSYKBSML7y4cIk0PpA+gD6QPoAMFOSoSGhUIehFqBSkHCAEMjLBVADzxYB+gLLaslx+wAlwgAl10nCArCOF1BFcIAQyMsFUAPPFgH6AstqyXH7ABAjkjQ04lpwgBDIywVQA88WAfoCy2rJcfsAcCCCEF/MPRSBwCCIYAYyMsFKs8WIfoCy2rLHxPLPyPPFlADzxbKACH6AsoAyYMG+wBxVVAGyMsAFcsfUAPPFgHPFgHPFgH6AszJ7VQC99AOhpgYC42EkvgnB9IBh2omhpgGmP/SB9IH0gfQBqGBNgAPloyhFrpOEBWccgGRwcKaDjgskvhHAoomOC+XD6AmmPwQgCicbIiV15cPrpn5j9IBggKwNkZYAK5Y+oAeeLAOeLAOeLAP0BZmT2qnAbE+OAcYED6Y/pn5gQwLCQFKwAGSXwvgIcACnzEQSRA4R2AQJRAkECPwBeA6wAPjAl8JhA/y8AoAyoIQO5rKABi+8uHJU0bHBVFSxwUVsfLhynAgghBfzD0UIYAQyMsFKM8WIfoCy2rLHxnLPyfPFifPFhjKACf6AhfKAMmAQPsAcQZQREUVBsjLABXLH1ADzxYBzxYBzxYB+gLMye1UABY3EDhHZRRDMHDwBTThaBI=";
        return ton_core_1.Cell.fromBase64(NftFixPriceSaleV2CodeBoc);
    }
}
exports.NftSale = NftSale;
//# sourceMappingURL=NftSale.js.map