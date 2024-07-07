"use client";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { baseURL } from "@/lib/baseData";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { loginSuccess } from "@/lib/features/authSlice";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [eyes, setEyes] = useState(false);
  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.length <= 0) {
      toast({
        variant: "destructive",
        title: "Incomplete data.",
        description: "Please fill in the username.",
      });
      return;
    }
    
    if (password.length <= 0) {
      toast({
        variant: "destructive",
        title: "Incomplete data.",
        description: "Please fill in the password.",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${baseURL}/sign-in.php`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      // console.log(response.data)
      if (response.data.success) {
        dispatch(loginSuccess(response.data.user));
        router.replace("/home");
      }
      if (response.data.success == false) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `${
            response.data.error ? response.data.error : "Please try again."
          }`,
        });
      }
    } catch (error) {
      // Handle error
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full p-4 min-h-screen">
      <div className="h-full w-full p-4 bg-white rounded-md max-w-[800px] mx-auto ">
        <div className="w-full mx-auto flex justify-center items-center">
          <Link href={"/home"}>
            <Image
              src={"/assets/images/doutya4.png"}
              alt="logo"
              width={150}
              height={150}
            />
          </Link>
        </div>
        <form
          onSubmit={handleSubmit}
          className="h-full w-full flex flex-col justify-center items-center p-2 mt-6 space-y-4"
        >
          <Image
            src={"/assets/images/sasd.png"}
            alt="logo"
            width={400}
            height={400}
          />
          <div className="w-full space-y-3 py-2">
            <p className="text-sm">Username</p>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3 w-full border border-slate-200 focus:border-slate-400 focus:outline-none rounded-md"
            />
          </div>
          <div className="w-full space-y-3">
            <p className="text-sm">Password</p>
            <div className="w-full grid grid-cols-12 ">
              <input
                type={eyes ?  "text" : "password"}

                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className=" col-span-10 md:col-span-11 p-3 w-full border border-slate-200 focus:border-slate-400 focus:outline-none rounded-md"
              />
              <p onClick={()=>setEyes((prevEyes)=>!prevEyes)} className="md:col-span-1 flex items-center justify-center  col-span-2 p-3 border border-slate-200 focus:border-slate-400 focus:outline-none rounded-md">
                {eyes ? <EyeOff /> : <Eye />}
              </p>
            </div>
          </div>
          <div className="py-3">
            <p className="font-bold">
              Don't have an account?{" "}
              <span>
                <Link className="font-bold text-blue-400" href={"/signup"}>
                  Signup
                </Link>
              </span>
            </p>
          </div>
          <div className="py-3">
            <p className="font-bold">
              Previously registered before 27-06-2024?{" "}
              <span>
                <Link
                  className="font-bold text-blue-400"
                  href={"/previous-users"}
                >
                  Add username
                </Link>
              </span>
            </p>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-3 bg-orange-300 px-7 py-2 text-white font-bold rounded-md"
          >
            {isLoading ? (
              <div className="spinner-border flex items-center gap-1">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="">Loading...</span>
              </div>
            ) : (
              <span>Submit</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
