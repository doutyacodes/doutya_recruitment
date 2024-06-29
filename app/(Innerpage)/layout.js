"use client"
import React, { useEffect } from "react";
import Navbar from "./(components)/Navbar";
import { redirect, usePathname } from "next/navigation";

const InnerLayout = ({ children }) => {
  // const pathname = usePathname();
  // useEffect(()=>{
  //   if (!pathname.includes("home")) {
  //     redirect("/home");
  //   }
  // },[pathname])
  return (
    <section className="w-full relative  bg-[url('/assets/images/bckgr3.png')] bg-cover bg-center">
    {/* Include shared UI here e.g. a header or sidebar */}
    <div className="absolute inset-0 bg-white bg-opacity-50 z-10"></div>
      {/* Include shared UI here e.g. a header or sidebar */}
      <div className=" h-full w-full mx-auto border z-20 relative">

      <Navbar />

      <main className="  flex-1  overflow-y-auto bg-gradient-to-r from-[#a3d9e3] to-[#d0f1c4]">
        {children}
      </main>

      {/* <footer className="bg-red-500 h-16 flex justify-center items-center"> */}
        {/* Footer content */}
      {/* </footer> */}
      </div>
    </section>
  );
};

export default InnerLayout;
