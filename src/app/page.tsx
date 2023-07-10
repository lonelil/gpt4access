"use client";
import Image from "next/image";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

type Input = {
  apiKey: string;
};

function maskKey(key: string) {
  let prefix = key.slice(0, 3);
  let maskedKey = prefix + key.slice(-4).padStart(key.length - 3, "*");
  return maskedKey;
}

function isValidKey(key: string) {
  return key.startsWith("sk-") && key.length === 51 ? true : false;
}

export default function Home() {
  const { register, handleSubmit, reset } = useForm<Input>();
  const [page, setPage] = useState("home");
  const [details, setDetails] = useState("");
  const [key, setKey] = useState("");
  const onSubmit: SubmitHandler<Input> = async (data) => {
    reset();

    if (!isValidKey(data.apiKey)) {
      setDetails(`Invalid API Key.`);
      setPage("bad");
      return;
    }

    setPage(`loading`);
    setKey(data.apiKey);
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${data.apiKey}`,
      },
    });

    if (!res.ok) {
      setDetails(`Invalid API Key.`);
      setPage("bad");

      return;
    }

    const models = await res.json();

    if (models.data.find((model: any) => model.id === "gpt-4")) {
      setPage("good");
      return;
    }

    setDetails(`Your key does not have GPT-4.`);
    setPage("bad");
  };

  const returnHome = () => {
    setKey("");
    setDetails("");
    setPage("home");
  };

  return (
    <main className="h-screen bg-black text-white flex justify-center flex-col items-center">
      {key ? <p className="text-zinc-500 mb-12">{maskKey(key)}</p> : <></>}
      {page === "home" ? (
        <div className="flex items-center space-x-4">
          <Image
            src="/GPT-4.png"
            width={150}
            height={150}
            alt="GPT-4"
            className="rounded-full ml-4"
          />
          <div>
            <h1 className="font-semibold text-2xl">GPT-4 API Access Checker</h1>
            <p className="max-w-lg mt-2">
              A handy and reliable tool that helps you check if you meet the
              requirements for accessing the most powerful and versatile natural
              language processing system ever created.
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                className="rounded-md outline-none p-2 text-black mt-4 w-full px-3"
                placeholder="Enter your API Key here"
                {...register("apiKey", { required: true })}
                type="password"
                required
              />
            </form>
          </div>
        </div>
      ) : page === "bad" ? (
        <>
          <FaXmark size={50} className="" />

          <h1 className="mt-8 text-2xl font-semibold">{details}</h1>

          <button
            onClick={() => returnHome()}
            className="p-4 py-2 bg-zinc-800 mt-4 rounded-xl"
          >
            Return Home
          </button>
        </>
      ) : page === "good" ? (
        <>
          <FaCheck size={50} className="" />

          <h1 className="mt-8 text-2xl font-semibold">
            Your key has GPT-4 Access!
          </h1>

          <button
            onClick={() => returnHome()}
            className="p-4 py-2 bg-zinc-800 mt-4 rounded-xl"
          >
            Return Home
          </button>
        </>
      ) : (
        <>
          <AiOutlineLoading size={50} className="animate-spin" />

          <h1 className="mt-8 text-2xl font-semibold">Checking...</h1>
        </>
      )}
    </main>
  );
}
