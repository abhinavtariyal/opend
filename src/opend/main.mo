import Principal "mo:base/Principal";
import NFTActorClass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter";
actor OpenD {

  private type Listing = {
   itemOwner:Principal;
   itemPrice:Nat;
  };

  var mapOfNfts = HashMap.HashMap<Principal,NFTActorClass.NFT>(1,Principal.equal,Principal.hash);
  var mapOfOwners = HashMap.HashMap<Principal,List.List<Principal>>(1,Principal.equal,Principal.hash);
  var mapOfListings = HashMap.HashMap<Principal,Listing>(1,Principal.equal,Principal.hash);
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
  };

  public query func getListedNfts():async [Principal]{
     let ids = Iter.toArray(mapOfListings.keys());
     return ids;
  };

  public shared(msg) func listItem(id:Principal,price:Nat):async Text{
   var item:NFTActorClass.NFT = switch(mapOfNfts.get(id))
   {
     case null return "NFT does not exists";
     case (?result) result;
   };

   let owner = await item.getNftOwner();
   if(Principal.equal(owner,msg.caller))
   {
    let newListing:Listing = {
        itemOwner = owner;
        itemPrice = price;
    };
    mapOfListings.put(id,newListing);
    return "Success";
   }
   else
   {
    return "Sorry you don't own this NFT";
   }
  };

  public query func getOpenDCanisterId(): async Principal{
    return Principal.fromActor(OpenD);
  };

  public query func isListed(id:Principal):async Bool{
    if(mapOfListings.get(id) == null){
        return false;
    }
    else
    {
        return true;
    }
  };

  public query func getOriginalOwner(id:Principal):async Principal{
    var listing :Listing = switch(mapOfListings.get(id)){
      case null return Principal.fromText("");
      case (?result) result;
    };
    return listing.itemOwner;
  };

  public query func getListedNftPrice(id:Principal):async Nat{
    var listing :Listing = switch(mapOfListings.get(id)){
      case null return 0;
      case (?result) result;
    };
    return listing.itemPrice;
  }
};
