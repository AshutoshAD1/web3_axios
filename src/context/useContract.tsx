"use client"
import { useContext } from "react";
import { ContractContext } from "./index";

export const useContract=()=>{
  const context=useContext(ContractContext);
  
  if(!context){
    throw Error("ERRORS")
  }
  return context;
}