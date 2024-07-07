"use client";
import React, { useState, useEffect } from "react";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { redirect, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { loginSuccess, storeMobile } from "@/lib/features/authSlice";
import axios from "axios";
import { baseURL } from "@/lib/baseData";
import { Loader2 } from "lucide-react";
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
import { auth } from "../(components)/firebase";
import { toast } from "@/components/ui/use-toast";
const Previous = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [user_id, setUser_id] = useState(null);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user2 = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user2 && user2?.id) {
      return redirect("/home");
    }
  }, [user2]);
  useEffect(() => {
    let interval;
    if (showOTP && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [showOTP, timer]);

  const onCaptchVerify = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
        size: "invisible",
        callback: (response) => {
          onSignInSubmit();
          // console.log(response);
        },
      });
    }
  };

  const onSignInSubmit = () => {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;
    const formatPh = countryCode + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setShowOTP(true);
        setTimer(30);
        setCanResend(false);
        setLoading(false);
        // setShowUser(true)
        
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  const onClick = async (formatPh) => {
    try {
      const response = await axios.get(
        `${baseURL}/checkAlreadyUser.php?phone=${formatPh}`
      );
      // console.log(response.data);
      if (response.data.success) {
        dispatch(loginSuccess(response.data.user));
        router.replace("/home");
      } else {
        router.replace("/register");
      }
    } catch (error) {
      console.error("error", error);
    }
  };
  const handleSubmit = async () => {
    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(ph)) {
    toast({
      variant: "destructive",
      title: "Invalid Phone Number",
      description: "Phone number must be exactly 10 digits and contain only numbers.",
    });
    return;
  }
    try {
      const formatPh = countryCode + ph;
      const response = await axios.get(
        `${baseURL}/check-user-exist.php?phone=${formatPh}`
      );
      console.log(response.data);
      if (response.data.success) {
        setUser_id(response.data.user_id)
        onSignInSubmit();
      }else {
        console.log(response.data.error);
        alert(response.data.error[0] || "Something went wrong.");
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const onResendOTP = () => {
    onSignInSubmit();
  };

  const onOTPVerify = async () => {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        setUser(res.user);
        const formatPh = countryCode + ph;
        dispatch(storeMobile({ phone: formatPh, uid: res.user.uid }));
        setShowUser(true)
        setShowOTP(!true)
      })
    
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleSubmited = async () => {
    if (!username) {
      alert("Please enter a username.");
      return;
    }
    
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    
    try {
     
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("user_id", user_id);
     
  
      // console.log(form);
  
      const response = await axios.post(`${baseURL}/change-data.php`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Use proper content type for FormData
        },
      });
  
      const result = response.data;
     
      
  
      // Proceed with the rest of your logic if the username exists and passwords match
      console.log(response.data);
      if (response.data.success) {
        dispatch(loginSuccess(response.data.user));
        router.replace("/home");
      } else {
        console.log(response.data.error);
        alert(response.data.error[0] || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error checking username:", error);
    }
  };
  
  return (
    <div className="h-full w-full p-4  min-h-screen">
      <div className="h-full w-full p-4 bg-white rounded-md ">
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
        <div className="w-full items-center justify-center flex">
          <div className="relative w-full min-h-56">
            <Image
              src={"/assets/images/sasd.png"}
              fill
              alt="logo"
              objectFit="contain"
            />
          </div>
        </div>
        <div className="px-4 md:px-10 flex flex-col justify-center mt-5 gap-3 w-full">
          {!showOTP && (
            <p className=" text-lg text-center font-bold ">
              Enter Your Mobile Number
            </p>
          )}
          {showOTP && !showUser && (
            <p className=" text-lg text-center font-bold ">Enter Your OTP</p>
          )}
          {showUser && !showOTP && (
            <>
              <input
                type="text"
                className="focus:outline-none p-3 bg-white border w-full rounded-lg"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                className="focus:outline-none p-3 bg-white border w-full rounded-lg"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="password"
                className="focus:outline-none p-3 bg-white border w-full rounded-lg"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                onClick={handleSubmited}
                className="bg-[#fdbd5b] mt-3 w-fit mx-auto"
              >
                Submit
              </Button>
            </>
          )}
          <div className="mt-2 p-3 space-y-5 w-full flex flex-col items-center gap-1">
            {!showOTP && (
              <>
                <input
                  type="number"
                  className="focus:outline-none p-3 bg-white border w-full rounded-lg"
                  placeholder="eg: 9876543210"
                  onChange={(e) => setPh(e.target.value)}
                />
              </>
            )}
            {showOTP && !showUser && (
              <>
                <input
                  type="number"
                  className="focus:outline-none p-3 bg-white border w-full rounded-lg"
                  placeholder="OTP"
                  onChange={(e) => setOtp(e.target.value)}
                />
                {canResend ? (
                  <Button onClick={onResendOTP} className="bg-red-500 mt-3">
                    Resend OTP
                  </Button>
                ) : (
                  <p className="font-bold">
                    Resend OTP in{" "}
                    <span className="text-red-700">{timer} s</span>
                  </p>
                )}
              </>
            )}
          </div>
          <div className="mx-auto justify-center flex w-full">
            {!showOTP && (
              <Button
                disabled={loading}
                onClick={handleSubmit}
                className="bg-[#fdbd5b]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <p>Please wait</p>
                  </>
                ) : (
                  <p className="font-bold text-lg">Next</p>
                )}
              </Button>
            )}
            {showOTP && (
              <Button
                disabled={loading}
                onClick={onOTPVerify}
                className="bg-[#fdbd5b]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <p>Please wait</p>
                  </>
                ) : (
                  <p className="font-bold text-lg">Submit</p>
                )}{" "}
              </Button>
            )}
          </div>
          <div id="sign-in-button"></div>
        </div>
        {/* <img
        src="/assets/images/vector-bg.svg"
        alt="svg"
        className="absolute bottom-0 left-0 max-md:w-[700px] md:min-w-[700px] max-md:h-64 md:h-32 opacity-30 z-[1] object-cover"
      /> */}
      </div>
    </div>
  );
};

export default Previous;
