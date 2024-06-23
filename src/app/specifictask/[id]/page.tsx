"use client"
import './style.css'
import NavBar from "@/app/components/NavBar";
import { useContract } from "@/context/useContract"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";

type Imgs = {
  cid: string,
  votes: string
}

export default function SpecificTask({ params: { id } }: { params: { id: string } }) {
  const url: string = 'https://silver-ready-termite-903.mypinata.cloud/ipfs/'
  const [images, setImgs] = useState<Imgs[] | []>([])
  const { contract_and_web3 } = useContract();
  const { contract, signer } = contract_and_web3;
  const [receipt, setReceipt] = useState(null)
  const [error, setError] = useState<string | null>(null)
  const [winner, setWinner] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const creator = searchParams.get('creator')

  const getSpecificTask = async () => {
    if (contract && signer) {
      const contractSigner = contract.connect(signer)
      const task = await contractSigner.getSpecificTask(creator, id);
      setImgs(task.img)
      setIsCompleted(task.isCompleted)
    }
  }

  useEffect(() => {
    getSpecificTask();
  }, [receipt, contract]);

  useEffect(() => {
    if (isCompleted) {
      getWinner();
    }
  }, [isCompleted]);

  const getWinner = async () => {
    if (contract && signer) {
      const contractSigner = contract.connect(signer)
      const winner = await contractSigner.getWinner(creator, BigInt(id));
      setWinner(winner)
    }
  }

  const voteImg = async (idx: number) => {
    if (contract && signer)  {
      try {
        const contractSigner = contract.connect(signer)
        const res = await contractSigner.voteTaskImg(creator, BigInt(id), BigInt(idx));
        const refresh = await res.wait();
        setReceipt(refresh)
      } catch (e:any) {
        console.log(e)
        const err = e.toString().split('reverted')[1].slice(2).trim().split(`"`)[0]
        console.log(err)
        setError(err)
      }
    }
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Task ID: {id}</h1>
        {winner !== null ? (
          <div className="flex items-center justify-center flex-col mb-8">
            <h1 className="font-bold text-xl mb-2">Winner</h1>
            <img className="w-48 h-48 object-cover rounded-md" src={url + winner} alt="Winner" />
          </div>
        ) : (
          <p className="text-center mb-8">Not completed</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((imag, idx) => (
            <div key={idx} className="border rounded-md p-4 shadow-lg">
              <img className="w-full h-48 object-cover mb-4" src={url + imag.cid} alt={`Image ${idx}`} />
              <p className="text-center mb-4">Votes: {imag.votes.toString()}</p>
              <button 
                className="w-full p-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
                onClick={() => voteImg(idx)}
              >
                Vote
              </button>
            </div>
          ))}
        </div>
        {error !== null && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </>
  )
}
