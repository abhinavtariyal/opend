import Principal "mo:base/Principal";
import NFTActorClass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import List "mo:base/List"

actor OpenD {

  var mapOfNfts = HashMap.HashMap<Principal,NFTActorClass.NFT>(1,Principal.equal,Principal.hash);
  var mapOfOwners = HashMap.HashMap<Principal,List.List<Principal>>(1,Principal.equal,Principal.hash);

  public shared(msg) func mint(imgData:[Nat8],name:Text):async Principal{
   let owner:Principal = msg.caller;
   
   Cycles.add(100_500_000_000);
   let newNFT = await NFTActorClass.NFT(name,owner,imgData);
   Debug.print(debug_show(Cycles.balance()));
 
   let newNFTPrincipal =  await newNFT.getCanisterId();
   mapOfNfts.put(newNFTPrincipal,newNFT);
   addToOwnershipMap(owner,newNFTPrincipal);
   return newNFTPrincipal;
  };

  private func addToOwnershipMap(owner:Principal,nftId:Principal){
   var ownedNfts:List.List<Principal> = switch(mapOfOwners.get(owner))
   {
     case null List.nil<Principal>();
     case (?result) result;
   };

   ownedNfts:= List.push(nftId,ownedNfts);
   mapOfOwners.put(owner,ownedNfts);
  };

  public query func getOwnedNfts(owner:Principal):async [Principal]
  {
    var userNfts:List.List<Principal> = switch(mapOfOwners.get(owner))
   {
     case null List.nil<Principal>();
     case (?result) result;
   };
   return List.toArray(userNfts);
  }
};
