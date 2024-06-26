"use client";
import Image from "next/image";
import { IoSettingsSharp } from "react-icons/io5";
import { AlignJustify, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import RightSidebar from "./RightSidebar";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  RiHome5Fill,
  RiHome5Line,
  RiClipboardFill,
  RiClipboardLine,
  RiUser3Line,
  RiUser3Fill,
} from "react-icons/ri";

import LeftSidebar from "./LeftSidebar";
import { useEffect, useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  // const user = useAppSelector((state) => state.auth.user);
  // const router = useRouter();
  // const [sheetOpen, setSheetOpen] = useState(false);
  // const [sheetOpen2, setSheetOpen2] = useState(false);

  useEffect(()=>{
    if (!pathname.includes("home")) {
      redirect("/home");
    }
  },[pathname])
  return (
    <nav className="w-full p-3 bg-white">
      <ul className="w-full flex justify-center items-center">
      
        <li>
          <Link href={"/home"}>
          <Image
            src="/assets/images/doutya4.png"
            alt="logo"
            width={120}
            height={60}
            className=" rounded-md"
          /></Link>
        </li>
        
      </ul>
      
    </nav>
  );
};

export default Navbar;
