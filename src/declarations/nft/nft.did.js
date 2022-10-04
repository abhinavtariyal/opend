export const idlFactory = ({ IDL }) => {
  const NFT = IDL.Service({
    'getCanisterId' : IDL.Func([], [IDL.Principal], ['query']),
    'getImageBytes' : IDL.Func([], [IDL.Vec(IDL.Nat8)], ['query']),
    'getName' : IDL.Func([], [IDL.Text], ['query']),
    'getNftOwner' : IDL.Func([], [IDL.Principal], ['query']),
  });
  return NFT;
};
export const init = ({ IDL }) => {
  return [IDL.Text, IDL.Principal, IDL.Vec(IDL.Nat8)];
};