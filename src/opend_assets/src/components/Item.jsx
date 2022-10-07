import React, { useEffect,useState } from "react";
import logo from "../../assets/logo.png";
import {Actor,HttpAgent} from "@dfinity/agent"
import {idlFactory}  from "../../../declarations/nft";
import {Principal}  from "@dfinity/principal";
import { debug } from "util";
import { url } from "inspector";
import Button from "./Button";
import {opend} from "../../../declarations/opend";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";

function Item(props) {
  const[name,setName] = useState();
  const id = props.id;

  const[ownerId,setOwnerId] = useState();
  const[image,setImage] = useState(); 
  const[priceInput,setPriceInput] = useState();
  const[button,setButton] = useState();
  const[loaderHidden,setLoaderHidden] = useState(true);
  const[blur,setBlur] = useState();
  const[priceLabel,setPriceLabel] =useState();
  const[sellStatus,setSellStatus] = useState("");
  const localHost = "http://localhost:8080/";
  const agent = new HttpAgent({host:localHost});
  agent.fetchRootKey();
  let NFTActor;
  async function loadNft(){
      NFTActor = await Actor.createActor(idlFactory,{
      agent,
      canisterId: id
    });

    const name = await NFTActor.getName();
    setName(name);

    const owner = await NFTActor.getNftOwner();
    setOwnerId(owner.toText());

    const imgData = await NFTActor.getImageBytes();
    const imgContent = new Uint8Array(imgData);
    const img = URL.createObjectURL(new Blob([imgContent.buffer],{type:"image/png"})); 
    setImage(img);

    if(props.role === "collection"){
      const isListed = await opend.isListed(props.id)

      if(isListed){
        setSellStatus("Listed");
        setOwnerId("OpenD");
        setBlur({filter: "blur(4px)"});
      }
      else
      {
        setButton(<Button handleClick ={handleSell} text = "Sell"/>);
      }
    }
    else if(props.role === "listing")
    {
      const originalOwner = opend.getOriginalOwner(props.id);
      if(originalOwner.toText != CURRENT_USER_ID.toText){
        setButton(<Button handleClick ={handleBuy} text = "Buy"/>);
      }
      const price = opend.getListedNftPrice(props.id);
      setPriceLabel(<PriceLabel sellPrice = {price.toString()}/>)
    }
    
  }

  useEffect(() => {
    loadNft()
  },
  [])

  let price;
  function handleSell(){
    //console.log("sell clicked");
    setPriceInput(<input
      placeholder="Price in IKKIN"
      type="number"
      className="price-input"
      value={price}
      onChange={(e) => price = e.target.value}
    />)
    setButton(<Button handleClick ={sellItem} text = "Confirm"/>)
  }

  async function sellItem(){
  setBlur({filter: "blur(4px)"});   
  setLoaderHidden(false);
   console.log("confirmed clicked");
   const listingResult = await opend.listItem(props.id,Number(price));
   console.log("Listing is"+listingResult);
   if(listingResult === "Success"){
    const opendId = await opend.getOpenDCanisterId();
    console.log(opendId);
    const transferResult = await NFTActor.transferOwnership(opendId);
    console.log(transferResult);
    if(transferResult == "Success"){
      setLoaderHidden(true);
      setPriceInput();
      setButton();
      setOwnerId("OpenD");
      setSellStatus("Listed");
    }
   }
  }

  async function handleBuy(){
    console.log("buy was triggered");
  }
    return (
      <div className="disGrid-item">
        <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
          <img
            className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
            src={image}
            style = {blur}
          />
          <div className="lds-ellipsis" hidden ={loaderHidden}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="disCardContent-root">
          {priceLabel}
            <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
              {name}<span className="purple-text"> {sellStatus}</span>
            </h2>
            <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
              Owner: {ownerId};
            </p>
            {priceInput}
            {button}
          </div>
        </div>
      </div>
    )
}

export default Item;
