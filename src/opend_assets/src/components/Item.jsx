import React, { useEffect,useState } from "react";
import logo from "../../assets/logo.png";
import {Actor,HttpAgent} from "@dfinity/agent"
import {idlFactory}  from "../../../declarations/nft";
import {Principal}  from "@dfinity/principal";
import { debug } from "util";
import { url } from "inspector";

function Item(props) {
  const[name,setName] = useState();
  const id = props.id;

  const[ownerId,setOwnerId] = useState();
  const[image,setImage] = useState(); 
  
  const localHost = "http://localhost:8080/";
  const agent = new HttpAgent({host:localHost});

  async function loadNft(){
    const NFTActor = await Actor.createActor(idlFactory,{
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
  }

  useEffect(() => {
    loadNft()
  },
  [])

    return (
      <div className="disGrid-item">
        <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
          <img
            className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
            src={image}
          />
          <div className="disCardContent-root">
            <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
              {name}<span className="purple-text"></span>
            </h2>
            <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
              Owner: {ownerId};
            </p>
          </div>
        </div>
      </div>
    )
}

export default Item;
