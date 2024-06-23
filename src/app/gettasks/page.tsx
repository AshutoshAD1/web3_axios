"use client";
import React, { Suspense } from "react";
import { useContract } from "@/context/useContract";
import { useEffect, useState } from "react";
// import NavBar from "../components/NavBar";
import Link from "next/link";
import NavBar from "../components/NavBar";
import { checkTaskCompletion } from "../utils/checkingCompletion";

type Tasks = {
  title: string;
  creator: string;
  id: number;
};

const Page = () => {
  const { contract_and_web3 } = useContract();
  const { contract, address } = contract_and_web3;
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [connectMetaMask, setConnectToMetaMask] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Map<string, boolean>>(new Map());
  const [youCompletedTask, setYouCompletedTask] = useState<Map<string, boolean>>(new Map());
  const [loading, setLoading] = useState(true);

  const getTasks = async () => {
    if (contract && address.length > 0) {
      const task = await contract.getAllTasks();
      setTasks(task);
    }
  };

  useEffect(() => {
    if (contract) {
      setConnectToMetaMask(false);
      setLoading(true);
      getTasks().finally(() => setLoading(false));
    } else {
      setTasks([]);
      setConnectToMetaMask(true);
      setCompletedTasks(new Map());
      setYouCompletedTask(new Map());
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    if (tasks.length > 0) {
      tasks.forEach(task => {
        checkTaskCompletion(contract, task.creator, task.id)
          .then(res => setCompletedTasks(prevState => new Map(prevState).set(`${task.creator}-${Number(task.id)}`, res)))
          .catch(e => console.log(e));
        getYouVoted(task.creator, task.id);
      });
    }
  }, [tasks]);

  const getYouVoted = async (creator: string, idx: number) => {
    if (contract && address) {
      const voted = await contract.votedByUser(address, creator, BigInt(idx));
      setYouCompletedTask(prevState => new Map(prevState).set(`${creator}-${Number(idx)}`, voted));
    }
  };

  return (
    <div>
        <NavBar/>
      {connectMetaMask ? (
        <p>Connect to MetaMask</p>
      ) : (
        <>
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length > 0 ? (
            tasks.map(task => (
              <ul key={task.id}>
                {youCompletedTask.has(`${task.creator}-${task.id}`) && !youCompletedTask.get(`${task.creator}-${task.id}`) && !completedTasks.get(`${task.creator}-${task.id}`) ? (
                  <Link href={{ pathname: `/specifictask/${task.id.toString()}`, query: { creator: task.creator } }}>
                    <p>{task.title}</p>
                  </Link>
                ) : null}
              </ul>
            ))
          ) : (
            <p>No tasks</p>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
