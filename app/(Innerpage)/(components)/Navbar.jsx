"use client";
import Image from "next/image";
import { IoSettingsSharp } from "react-icons/io5";
import { AlignJustify, Clipboard, Home, Search, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import RightSidebar from "./RightSidebar";
import { MdHome } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { IoMdAnalytics } from "react-icons/io";
import { IoAnalytics } from "react-icons/io5";

import LeftSidebar from "./LeftSidebar";
import { useEffect, useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetOpen2, setSheetOpen2] = useState(false);
  // useEffect(() => {
  //   if ( !pathname.includes("coming-soon") && !pathname.includes("coming-soon")) {
  //     router.replace("/coming-soon");
  //   }
  // }, [user, pathname, router]);

  return (
    <nav className="w-full p-3 bg-white">
      <ul className="w-full flex justify-between items-center">
        <li>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger>
              <Search size={24} />
            </SheetTrigger>
            <SheetContent side={"left"}>
              <LeftSidebar setSheetOpen={setSheetOpen} />
            </SheetContent>
          </Sheet>
        </li>
        <li>
          <Image
            src="/assets/images/doutya4.png"
            alt="logo"
            width={120}
            height={60}
            className=" rounded-md"
          />
        </li>
        <li>
          {!user ? (
            <Button>
              <Link prefetch={false} href="/signup" className="w-full">
                Login
              </Link>
            </Button>
          ) : (
            <div className="flex gap-5 items-center">
              <Sheet open={sheetOpen2} onOpenChange={setSheetOpen2}>
                <SheetTrigger>
                  <AlignJustify size={24} />
                </SheetTrigger>
                <SheetContent side={"right"}>
                  <RightSidebar setSheetOpen2={setSheetOpen2} />
                </SheetContent>
              </Sheet>
            </div>
          )}
        </li>
      </ul>
      <div className="  fixed py-1 px-3  w-full left-0 bottom-0 z-50 ">
        <div className=" px-3 py-1 max-w-[800px] rounded-full  bg-[#24975c]/95 border mx-auto relative flex w-full justify-around items-center">
          <Link
            prefetch={false}
            href={"/home"}
            className=" w-1/3 text-sm flex flex-col items-center justify-center"
          >
            {pathname.includes("home") ? (
              <RiHome5Fill
                color={pathname.includes("home") ? "#fdbd5b" : "white"}
                size={24}
              />
            ) : (
              <RiHome5Line
                color={pathname.includes("home") ? "#fdbd5b" : "white"}
                size={24}
              />
            )}
            <p
              className={
                pathname.includes("home") ? "text-[#fdbd5b]" : "text-white"
              }
            >
              Home
            </p>
          </Link>
          {/* <Link
            prefetch={false}
            href={"/analytics"}
            className=" w-1/3 text-sm flex flex-col items-center justify-center"
          >
            {pathname.includes("analytics") ? (
              <IoMdAnalytics
                color={pathname.includes("analytics") ? "#fdbd5b" : "white"}
                size={24}
              />
            ) : (
              <IoAnalytics
                color={pathname.includes("analytics") ? "#fdbd5b" : "white"}
                size={24}
              />
            )}
            <p
              className={
                pathname.includes("analytics") ? "text-[#fdbd5b]" : "text-white"
              }
            >
              Analytics
            </p>
          </Link> */}
          <Link
            prefetch={false}
            href={"/results"}
            className="w-1/3 text-sm flex-wrap flex flex-col items-center justify-center"
          >
            {pathname.includes("results") ? (
              <RiClipboardFill
                color={pathname.includes("results") ? "#fdbd5b" : "white"}
                size={24}
              />
            ) : (
              <RiClipboardLine
                color={pathname.includes("results") ? "#fdbd5b" : "white"}
                size={24}
              />
            )}
            <p
              className={
                pathname.includes("results") ? "text-[#fdbd5b]" : "text-white"
              }
            >
              Results
            </p>
          </Link>
          {user ? (
            <div className="w-1/3 text-sm flex-wrap flex flex-col items-center justify-center">
              <Sheet open={sheetOpen2} onOpenChange={setSheetOpen2}>
                <SheetTrigger>
                  {pathname.includes("user") ? (
                    <RiUser3Fill
                      color={pathname.includes("user") ? "#fdbd5b" : "white"}
                      size={24}
                      className="mx-auto"
                    />
                  ) : (
                    <RiUser3Line
                      color={pathname.includes("user") ? "#fdbd5b" : "white"}
                      size={24}
                      className="mx-auto"
                    />
                  )}
                  <p
                    className={
                      pathname.includes("user")
                        ? "text-[#fdbd5b]"
                        : "text-white"
                    }
                  >
                    Profile
                  </p>
                </SheetTrigger>
                <SheetContent side={"right"}>
                  <RightSidebar setSheetOpen2={setSheetOpen2} />
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <Link
              prefetch={false}
              href={"/signup"}
              className="w-1/3 text-sm flex-wrap flex flex-col items-center justify-center"
            >
              {pathname.includes("user") ? (
                <RiUser3Fill
                  color={pathname.includes("signup") ? "#fdbd5b" : "white"}
                  size={24}
                />
              ) : (
                <RiUser3Line
                  color={pathname.includes("signup") ? "#fdbd5b" : "white"}
                  size={24}
                />
              )}
              <p
                className={
                  pathname.includes("signup") ? "text-[#fdbd5b]" : "text-white"
                }
              >
                Profile
              </p>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
