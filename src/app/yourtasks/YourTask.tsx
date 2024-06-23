'use client'

import { useContract } from "@/context/useContract";
import Link from "next/link";
import { useEffect, useState } from "react";
import { checkTaskCompletion } from "../utils/checkingCompletion";

type Task = {
  title: string;
  img: { cid: string; votes: number }[];
  isCompleted: boolean;
};

const YourTask = () => {
  const [winner, setWinner] = useState<string | null>(null);
  const { contract_and_web3 } = useContract();
  const { contract, signer, address } = contract_and_web3;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [connectMetaMask, setConnectMetaMask] = useState(false);

  const getYourTasks = async () => {
    if (contract && signer) {
      setConnectMetaMask(false);
      const contractSigner = contract.connect(signer);
      const tasks = await contractSigner.getYourTasks();
      setTasks(tasks);
    } else {
      setConnectMetaMask(true);
      setWinner(null);
      setTasks([]);
    }
  };

  useEffect(() => {
    getYourTasks();
  }, [contract]);

  return (
    <div className="min-h-screen bg-black text-white">
      {connectMetaMask ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-xl">Connect to MetaMask</p>
        </div>
      ) : (
        tasks.length>0?
        
        <div className="p-8">
          {tasks.map((task, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-800 rounded-lg shadow-lg">
              <Link href={{ pathname: `/specifictask/${index}`, query: { creator: address } }}>
                <p className="block text-lg font-bold">{task.title}</p>
              </Link>
              <p className={`mt-2 ${task.isCompleted ? "text-green-500" : "text-red-500"}`}>
                {task.isCompleted ? "Completed" : "Not Completed"}
              </p>
            </div>
          ))}
        </div>
        :
        <p>Create New Task</p>
      )}
    </div>
  );
};

export default YourTask;


// 'use client'

// import { useContract } from "@/context/useContract"
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { checkTaskCompletion } from "../utils/checkingCompletion";
// type Task={
//   title : string,
//   img:[{cid:string, votes:number}]
//   isCompleted:boolean
// }
// const YourTask = () => {
//   const [winner,setWinner]=useState<string | null>(null)
//   const {contract_and_web3}=useContract();
//   const {contract,signer,address}=contract_and_web3;
//   const [task,setTasks]=useState<Task[] | []>([])
//   const [connectMetaMask,setConnectMetaMask]=useState(false)
//   const [completedTasks, setCompletedTasks] = useState<Map<number, boolean>>(new Map());
   
//   function getWinner(winner:string){
//     setWinner(winner);

//   }
//   const getYourTasks=async ()=>{
//     if(contract){
// setConnectMetaMask(false)
//       const contractSigner=contract.connect(signer);
//        const tasks=await contractSigner.getYourTasks();
//        setTasks(tasks)
//     }
//     else{
//       setConnectMetaMask(true)
//       setWinner(null)
//       setTasks([])
//       setCompletedTasks(new Map())
//     }
//   }
//   useEffect(()=>{
//     console.log(contract)
//     getYourTasks();
//   },[contract])

  
//   return (
//     <div>
//       {connectMetaMask?
//       <p>Connect To MetaMask</p>
//       :
//       <>
      
//       {task.map((tas,index)=><div>
//         <Link href={{pathname:specifictask/${index},query:{creator:address}}}>{tas.title}</Link>
//         <h1>{tas.isCompleted?"Completed":"Not Completed"}</h1>
//       </div>)}
//       </>
//       }
//     </div>
//   )
// }

// export default YourTask