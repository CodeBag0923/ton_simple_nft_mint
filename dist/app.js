"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv = __importStar(require("dotenv"));
const ton_core_1 = require("ton-core");
const promises_1 = require("fs/promises");
const utils_1 = require("./utils");
const delay_1 = require("./delay");
const NftCollection_1 = require("./contracts/NftCollection");
const NftItem_1 = require("./contracts/NftItem");
const metadata_1 = require("./metadata");
const NftSale_1 = require("./contracts/NftSale");
const NftMarketplace_1 = require("./contracts/NftMarketplace");
dotenv.config();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const metadataFolderPath = "./data/metadata/";
        const imagesFolderPath = "./data/images/";
        const wallet = yield (0, utils_1.openWallet)(process.env.MNEMONIC.split(" "), true);
        console.log("Started uploading images to IPFS...");
        const imagesIpfsHash = yield (0, metadata_1.uploadFolderToIPFS)(imagesFolderPath);
        console.log(`Successfully uploaded the pictures to ipfs: https://gateway.pinata.cloud/ipfs/${imagesIpfsHash}`);
        console.log("Started uploading metadata files to IPFS...");
        yield (0, metadata_1.updateMetadataFiles)(metadataFolderPath, imagesIpfsHash);
        const metadataIpfsHash = yield (0, metadata_1.uploadFolderToIPFS)(metadataFolderPath);
        console.log(`Successfully uploaded the metadata to ipfs: https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`);
        console.log("Start deploy of nft collection...");
        const collectionData = {
            ownerAddress: wallet.contract.address,
            royaltyPercent: 0.05, // 0.05 = 5%
            royaltyAddress: wallet.contract.address,
            nextItemIndex: 0,
            collectionContentUrl: `ipfs://${metadataIpfsHash}/collection.json`,
            commonContentUrl: `ipfs://${metadataIpfsHash}/`,
        };
        const collection = new NftCollection_1.NftCollection(collectionData);
        let seqno = yield collection.deploy(wallet);
        console.log(`Collection deployed: ${collection.address}`);
        yield (0, delay_1.waitSeqno)(seqno, wallet);
        // Deploy nft items
        const files = yield (0, promises_1.readdir)(metadataFolderPath);
        files.pop();
        let index = 0;
        seqno = yield collection.topUpBalance(wallet, files.length);
        yield (0, delay_1.waitSeqno)(seqno, wallet);
        console.log(`Balance top-upped`);
        for (const file of files) {
            console.log(`Start deploy of ${index + 1} NFT`);
            const mintParams = {
                queryId: 0,
                itemOwnerAddress: wallet.contract.address,
                itemIndex: index,
                amount: (0, ton_core_1.toNano)("0.05"),
                commonContentUrl: file,
            };
            const nftItem = new NftItem_1.NftItem(collection);
            seqno = yield nftItem.deploy(wallet, mintParams);
            console.log(`Successfully deployed ${index + 1} NFT`);
            yield (0, delay_1.waitSeqno)(seqno, wallet);
            index++;
        }
        console.log("Start deploy of new marketplace  ");
        const marketplace = new NftMarketplace_1.NftMarketplace(wallet.contract.address);
        seqno = yield marketplace.deploy(wallet);
        yield (0, delay_1.waitSeqno)(seqno, wallet);
        console.log("Successfully deployed new marketplace");
        const nftToSaleAddress = yield NftItem_1.NftItem.getAddressByIndex(collection.address, 0);
        const saleData = {
            isComplete: false,
            createdAt: Math.ceil(Date.now() / 1000),
            marketplaceAddress: marketplace.address,
            nftAddress: nftToSaleAddress,
            nftOwnerAddress: null,
            fullPrice: (0, ton_core_1.toNano)("10"),
            marketplaceFeeAddress: wallet.contract.address,
            marketplaceFee: (0, ton_core_1.toNano)("1"),
            royaltyAddress: wallet.contract.address,
            royaltyAmount: (0, ton_core_1.toNano)("0.5"),
        };
        const nftSaleContract = new NftSale_1.NftSale(saleData);
        seqno = yield nftSaleContract.deploy(wallet);
        yield (0, delay_1.waitSeqno)(seqno, wallet);
        yield NftItem_1.NftItem.transfer(wallet, nftToSaleAddress, nftSaleContract.address);
    });
}
void init();
//# sourceMappingURL=app.js.map