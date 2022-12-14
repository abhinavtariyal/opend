import React,{useEffect, useState} from "react";
import { propTypes } from "../../../../node_modules/react-bootstrap/esm/Image";
import Item from "./Item";
import {Principal} from "@dfinity/principal"

function Gallery(props) {
const[items,setItems] = useState();
function fetchNfts(){
  if(props.ids != undefined){
    setItems(
      props.ids.map((NFTid) => (
        <Item id = {NFTid} key={NFTid.toText()} role = {props.role}/>
      ))
    )
  }
}

useEffect(() => {
  fetchNfts();
},[]);

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">{props.name}</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
          {items}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
