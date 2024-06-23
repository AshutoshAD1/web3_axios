"use client"
import React, { useEffect, useState } from 'react'
import { Contract, ethers } from 'ethers'
import Link from 'next/link'
import { abi } from '../utils/abi'
import { useContract } from '@/context/useContract'
import { Ultra } from 'next/font/google'
const NavBar = () => {
  const [account,setAccount]=useState<string|null>(null)
  const {dispatch}=useContract()
  const [connected,setConnected]=useState(false);
  const connectWallet=async ()=>{
    
    try{
       const accounts:any=await window.ethereum.request({method:"eth_requestAccounts"});
       setAccount(accounts[0]);
       localStorage.setItem('address',accounts[0]);
       setConnected(prev=>true);

       const provider = new ethers.providers.Web3Provider(window.ethereum);
       const signer=provider.getSigner();
       const contract=new ethers.Contract('0x9d3e423ab912541d84b12bd9fcb93cd2af283d5a',abi,signer)
       dispatch({type:"SET_CONTRACT",payload:{contract,signer,address:accounts[0]}})
      }
    catch(e:any){
      setConnected(false)
      console.log(e)
    }
  }
  console.log(connected)
  useEffect(()=>{
    const changedAccount=()=>{

        // window.ethereum.on('accountsChanged',async (accounts:string[])=>{
        //   if(accounts.length>0){
        //     console.log(accounts)
        //     setAccount(accounts[0]);
        //   }
        // })
        (window.ethereum as any)?.on('accountsChanged', async (accounts: string[]) => {
          if (accounts.length > 0) {
            console.log(accounts);
            setAccount(accounts[0]);
          }
        });
      
    } 
    changedAccount();
    if(localStorage.getItem('address')!=null){
      connectWallet();
    }
  },[])
  const disConnectWallet=()=>{
    localStorage.removeItem('address');
    dispatch({type:'RESET_CONTRACT',payload:{  contract: null, signer: null, address: ''}})
    setAccount(null)
    setConnected(prev=>false)
  }
  return (
    <div className='flex justify-between px-8 py-4 bg-black text-white items-center'>
      <Link href={'/'}>Voting Image</Link>
      <div className='flex gap-6'>
        <Link href={'/gettasks'}>Tasks</Link>
        <Link href={'/createTask'}>Create Tasks</Link>
        <Link href={'/yourtasks'}>Your Tasks</Link>

      </div>
      <div className='flex gap-4 items-center'>
        <button onClick={connectWallet} className={`p-2 rounded-md ${account == null ? 'bg-red-500' : 'bg-green-300'}`}>
  {account == null ? 'Connect' : account.slice(0,4)+"..."+account.slice(4,8)}
</button>
{connected===true?
  <button onClick={disConnectWallet} className='p-2 rounded-md bg-red-500 ' >
  Disconnect
</button>:null}
</div>
      
    </div>
  )
}

export default NavBar
