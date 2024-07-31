import { KeyPair, mnemonicToPrivateKey } from "ton-crypto";
import {
  beginCell,
  Cell,
  OpenedContract,
  TonClient,
  WalletContractV4,
} from "ton";

export type OpenedWallet = {
  contract: OpenedContract<WalletContractV4>;
  keyPair: KeyPair;
};

export async function openWallet(mnemonic: string[], testnet: boolean) {
  const keyPair = await mnemonicToPrivateKey(mnemonic);
  const toncenterBaseEndpoiint = testnet ? "https://testnet.toncenter.com" : "https://toncenter.com";
  const client = new TonClient({
    endpoint: `${toncenterBaseEndpoiint}/api/v2/jsonRPC`,
    apiKey: process.env.TONCENTER_API_KEY
  });
  const wallet = WalletContractV4.create({
    workchain: 0,
    publicKey: keyPair.publicKey
  })

  const contract = client.open(wallet);
  return {contract, keyPair}
}

