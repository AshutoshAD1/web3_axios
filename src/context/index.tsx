// "use client"
// import { Contract } from "ethers";
// import { createContext, useReducer } from "react"
// export const ContractContext=createContext({contract_and_web3:{contract:Contract,signer:null, address:''}});
// export const contractReducer=(state:any,action:{type:string|null , payload:{contract:any,signer:any,address:string | null}})=>{
//   switch(action.type){
//     case 'SET_CONTRACT':
//       return {
//         contract_and_web3:action.payload
        
//       }
//     case 'RESET_CONTRACT':
//       return {
//         contract_and_web3:{contract:null,signer:null, address:''}
//       }
//       default:
//         return state
//   }
// }

// export const ContractContextProvider=({children}:{children:React.ReactNode})=>{
//   const [state,dispatch]=useReducer(contractReducer,{contract_and_web3:{contract:null,signer:null, address:''}});
//   return (
//     <ContractContext.Provider value={{...state,dispatch}}>
//       {children}
//     </ContractContext.Provider>
//   )
// }


"use client"
import React, { createContext, useReducer, ReactNode, Dispatch } from "react";
import { Contract, Signer } from "ethers";

// Define types
interface ContractAndWeb3 {
  contract: Contract | null;
  signer: Signer | null;
  address: string;
}

interface State {
  contract_and_web3: ContractAndWeb3;
}

interface Action {
  type: 'SET_CONTRACT' | 'RESET_CONTRACT';
  payload: ContractAndWeb3;
}

interface ContractContextType extends State {
  dispatch: Dispatch<Action>;
}

// Create context with default values
export const ContractContext = createContext<ContractContextType>({
  contract_and_web3: { contract: null, signer: null, address: '' },
  dispatch: () => null,
});

// Reducer function
export const contractReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_CONTRACT':
      return { contract_and_web3: action.payload };
    case 'RESET_CONTRACT':
      return { contract_and_web3: { contract: null, signer: null, address: '' } };
    default:
      return state;
  }
};

// Context provider component
export const ContractContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(contractReducer, {
    contract_and_web3: { contract: null, signer: null, address: '' },
  });

  return (
    <ContractContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ContractContext.Provider>
  );
};
