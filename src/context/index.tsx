"use client"
import { createContext, useReducer } from "react"
export const ContractContext=createContext({contract_and_web3:{contract:{},signer:null, address:''}});
export const contractReducer=(state:any,action:{type:string|null , payload:{contract:any,signer:any,address:string | null}})=>{
  switch(action.type){
    case 'SET_CONTRACT':
      return {
        contract_and_web3:action.payload
        
      }
    case 'RESET_CONTRACT':
      return {
        contract_and_web3:{contract:null,signer:null, address:''}
      }
      default:
        return state
  }
}

export const ContractContextProvider=({children}:{children:React.ReactNode})=>{
  const [state,dispatch]=useReducer(contractReducer,{contract_and_web3:{contract:null,signer:null, address:''}});
  return (
    <ContractContext.Provider value={{...state,dispatch}}>
      {children}
    </ContractContext.Provider>
  )
}