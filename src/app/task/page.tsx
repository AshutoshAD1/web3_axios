"use client"

import { useContract } from "@/context/useContract"
import NavBar from "../components/NavBar"

export default function Page(){
  const {contract_and_web3}=useContract()
  console.log(contract_and_web3)
  const getAllTasks=async ()=>{
    const tasks = await contract_and_web3.contract.getAllTasks();
    console.log(tasks)

  }
  return  <>
  <NavBar/>
   <button onClick={getAllTasks} className="bg-red-500"> get</button>
   </>
}