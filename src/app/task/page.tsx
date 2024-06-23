"use client"

import { useContract } from "@/context/useContract"
import NavBar from "../components/NavBar"

export default function Page(){
  const {contract_and_web3}=useContract();
  const {contract}=contract_and_web3;
  console.log(contract_and_web3)
  const getAllTasks=async ()=>{
    if(contract){

      const tasks = await contract.getAllTasks();
    }

  }
  return  <>
  <NavBar/>
   <button onClick={getAllTasks} className="bg-red-500"> get</button>
   </>
}