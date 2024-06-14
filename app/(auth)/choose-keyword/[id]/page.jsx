"use client";
import SearchBar from "@/app/(Innerpage)/(components)/SearchBar";
import { baseURL } from "@/lib/baseData";
import { editUser } from "@/lib/features/authSlice";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ChooseKeyword() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [data, setData] = useState([]);
  const [itemColors, setItemColors] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [showDialog2, setShowDialog2] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (!user) {
      router.replace("/signup");
    } else {
      fetchUserKeywords();
    }
  }, [user]);

  const fetchKeyword = async () => {
    try {
      const response = await axios.get(`${baseURL}/search-keywords.php`);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserKeywords = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/get-user-keywords.php?user_id=${user.id}`
      );
      if (response.data.success) {
        setSelectedItems(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchKeyword();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const colors = [
        { from: "#D4145A", to: "#FBB03B" },
        { from: "#662D8C", to: "#ED1E79" },
        { from: "#614385", to: "#516395" },
      ];
      const assignedColors = data.reduce((acc, item, index) => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        acc[item.id] = randomColor;
        return acc;
      }, {});
      setItemColors(assignedColors);
    }
  }, [data]);

  const handleItemClick = (item) => {
    if (selectedItems.some((selectedItem) => selectedItem.id === item.id)) {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((selectedItem) => selectedItem.id !== item.id)
      );
    } else {
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, item]);
    }
  };

  const handleSubmit = async () => {
    if (user) {
      if (selectedItems.length > 0) {
        try {
          const requests = selectedItems.map((item) => {
            const payload = {
              user_id: user.id,
              keyword_id: item.id,
            };
            return axios.post(`${baseURL}/add-keywords.php`, payload, {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            });
          });

          const responses = await Promise.all(requests);
          const successResponses = responses.filter(
            (response) => response.data.success
          );
          const errorResponses = responses.filter(
            (response) => response.data.error
          );

          if (successResponses.length === selectedItems.length) {
            if (user.steps === 2) {
              router.replace("/home");
            } else {
              dispatch(editUser({ steps: 2 }));
              if (params.id == 2) {
                router.replace("/home");
              } else {
                router.replace("/follow-page");
              }
            }
          }
          if (errorResponses.length === selectedItems.length) {
            alert("Sorry you have to wait 1 week before updating the keywords");
          }
        } catch (error) {
          console.error("Submission error:", error);
          alert("An error occurred while submitting tasks.");
        }
      } else {
        alert("You must select at least one item to continue.");
      }
    } else {
      router.replace("/signup");
    }
  };

  return (
    <div className="h-full w-full p-4 bg-white min-h-screen">
      <div className="mt-0 w-full flex justify-center">
        <div className="relative w-32 h-24">
          <Image
            src={"/assets/images/doutya4.png"}
            fill
            alt="logo"
            objectFit="contain"
          />
        </div>
      </div>
      <div className="w-full p-2">
        <p className="text-center text-lg font-bold">
          Select the keywords you prefer.
        </p>
      </div>
      <div className="w-full max-h-[60vh] overflow-y-scroll grid grid-cols-12 rounded-md gap-3 py-4">
        {data?.length > 0 &&
          data.map((item, index) => {
            const { from, to } = itemColors[item.id] || {
              from: "#D4145A",
              to: "#FBB03B",
            };
            const isSelected = selectedItems.some(
              (selectedItem) => selectedItem.id === item.id
            );
            return (
              <div
                key={index}
                className={`rounded-full border shadow-md col-span-4 py-3 md:col-span-3 relative cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-tr from-blue-500 to-purple-500"
                    : "bg-gray-200"
                }`}
                onClick={() => handleItemClick(item)}
                style={{
                  background: `linear-gradient(to top right, ${from}, ${to})`,
                }}
              >
                <p
                  className="text-center text-white truncate px-2 max-h-10 overflow-hidden font-bold"
                  title={item.name}
                >
                  {item.name}
                </p>
                {isSelected && (
                  <div className="absolute right-0 top-0 rounded-full bg-[#0b6ebf] p-1">
                    <FaCheck color="white" size={10} />
                  </div>
                )}
              </div>
            );
          })}
      </div>
      <div className="mt-4 flex justify-center">
        <AlertDialog open={showDialog2} onOpenChange={setShowDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Limit Exceeded</AlertDialogTitle>
              <AlertDialogDescription>
                You can't select more than 2 keywords. Please deselect one
                before adding a new one.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowDialog2(false)}>
                Okay
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="mt-4 flex justify-center">
        <AlertDialog>
          <AlertDialogTrigger>
            <button
              className="bg-[#fdbd5b] text-white py-3 px-6 rounded-md"
              disabled={selectedItems.length < 1}
            >
              Submit
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You can change your selection in your profile section.{" "}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default ChooseKeyword;
