import type { Principal } from '@dfinity/principal';
export interface NFT {
  'getCanisterId' : () => Promise<Principal>,
  'getImageBytes' : () => Promise<Array<number>>,
  'getName' : () => Promise<string>,
  'getNftOwner' : () => Promise<Principal>,
  'transferOwnership' : (arg_0: Principal) => Promise<string>,
}
export interface _SERVICE extends NFT {}
