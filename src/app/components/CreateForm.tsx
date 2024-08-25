"use client"

import { useEffect, useState } from "react"
import { jwt } from "../utils/jwt";
import { useContract } from "@/context/useContract";

export default function CreateForm() {
  const [formDat, setFormData] = useState<{ title: string, targetVotes: number }>({ title: '', targetVotes: 0 });
  const [selectedFile, setSelectedFile] = useState<FileList | null>(null);
  const [imgHsh, setImgHsh] = useState<string[]>([]);
  const { contract_and_web3 } = useContract();
  const { contract, signer } = contract_and_web3;
  const [creating, setCreating] = useState(false);
  const [refresh, setRefresh] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formDat, [name]: value });
  }

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files);
    }
  };

  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      console.error("No files selected");
      return;
    }

    setCreating(true);
    try {
      const formData = new FormData();
      Array.from(selectedFile).forEach((file) => {
        formData.append("file", file);
      });
      const metadata = JSON.stringify({
        name: "File name",
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: formData,
        }
      );
      const resData = await res.json();

      const imgHash: string[] = resData.IpfsHash ? Array.from(selectedFile).map((file: any, idx) => resData.IpfsHash + `/${file.name}`) : [];
      setImgHsh(imgHash);
      console.log(imgHash)

      if (imgHash.length > 0 && contract) {
        try {
          if(contract && signer){

            const contractSigner = contract.connect(signer);
            
            const createTaskTx = await contractSigner.createTask(formDat.title, imgHash, BigInt(formDat.targetVotes));
            const receipt = await createTaskTx.wait();
            console.log(receipt);
            setRefresh(receipt);
          }
        } catch (e:any) {
          console.error(e);
        }
      }
    } catch (error:any) {
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    if (refresh !== null) {
      alert("Created");
    }
  }, [refresh]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create New Task</h2>
        <form onSubmit={handleSubmission}>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input required
              onChange={handleChange}
              type="text"
              name="title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Images</label>
            {/* <input required
              directory=""
              webkitdirectory=""
              type="file"
              onChange={changeHandler}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            /> */}
                <input
      required
      directory="" // Type assertion to bypass TypeScript error
      webkitdirectory="" // Type assertion to bypass TypeScript error
      type="file"
      onChange={changeHandler}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      {...({ directory: '', webkitdirectory: '' } as any)} // Type assertion to bypass TypeScript error
    />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Target Votes</label>
            <input required
              onChange={handleChange}
              name="targetVotes"
              type="number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button 
            className="w-full bg-purple-500 text-white py-3 rounded-lg font-bold hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
            type="submit"
            disabled={creating}
          >
            {!creating ? 'Submit' : 'Submitting'}
          </button>
        </form>
      </div>
    </div>
  );
}
