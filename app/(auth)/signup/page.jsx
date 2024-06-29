"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "@/app/(Innerpage)/(components)/CustomButton";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { baseURL } from "@/lib/baseData";
import { loginSuccess } from "@/lib/features/authSlice";
import axios from "axios";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import YearMonthPicker from "../(components)/YearMonthPicker";
import Image from "next/image";

const SignUp = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    name: "",
    mobile: "",
    education: "Post Doctoral Fellowship",
    college: "",
    date: new Date(),
    gender: "Mr",
    student: "no",
    country_id: 101,
    state_id: "",
    university: "",
    yearOfPassing: "",
    monthOfPassing: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(null);
  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);

  const fetchCountry = async () => {
    try {
      const response = await axios.get(`${baseURL}/country.php`);
      setCountry(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchState = async (country_id) => {
    if (form.country_id === 101) {
      try {
        const response = await axios.get(
          `${baseURL}/state.php?country_id=${country_id}`
        );
        setStates(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const dispatch = useAppDispatch();

  const calculateAge = (birthDate) => {
    const today = new Date();
    const dob = new Date(birthDate);
    let age = today.getFullYear() - dob.getFullYear();
    const month = today.getMonth() - dob.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (
      !form.email ||
      !form.username ||
      !form.password ||
      !form.name ||
      !form.education ||
      !date ||
      !form.gender ||
      !form.mobile
    ) {
      return alert("Please fill all fields to continue.");
    }
    const age = calculateAge(date);
    
    if (age < 18) {
      return alert("You must be at least 18 years old to sign up.");
    }
    try {
      setIsLoading(true);

      const formData = new URLSearchParams();
      formData.append("email", form.email);
      formData.append("username", form.username);
      formData.append("password", form.password);
      formData.append("name", form.name);
      formData.append("mobile", form.mobile);
      formData.append("education", form.education);
      formData.append("college", form.college);
      formData.append("university", form.university);
      formData.append("student", form.student);
      formData.append("date", formatDate(date));
      formData.append("gender", form.gender);
      formData.append("country_id", form.country_id);
      formData.append("state_id", form.state_id);
      formData.append("yearOfPassing", form.yearOfPassing);
      formData.append("monthOfPassing", form.monthOfPassing);

      const response = await axios.post(`${baseURL}/sign-up.php`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const result = response.data;
      // console.log(response.data)
      if (result.success) {
        dispatch(loginSuccess(result.user));
        router.replace("/follow-page");
      } else {
        console.log(result.error);
        alert(result.error[0] || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Something went wrong while submitting the form.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCountry();
  }, []);

  useEffect(() => {
    if (form.country_id) {
      fetchState(form.country_id);
    }
  }, [form.country_id]);

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
        <form className="max-w-md mx-auto">
          <h1 className="text-xl font-bold tracking-wide mt-3 text-center">
            Sign Up!
          </h1>

          <div className="space-y-4 mt-4">
            <div className="flex rounded-md">
              <Select
                onValueChange={(value) => setForm({ ...form, gender: value })}
              >
                <SelectTrigger className="w-[100px] rounded-l-md rounded-r-none focus:ring-white ring-white">
                  <SelectValue placeholder="Mr" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr">Mr</SelectItem>
                  <SelectItem value="Ms">Ms</SelectItem>
                  <SelectItem value="Mrs">Mrs</SelectItem>
                  <SelectItem value="None">__</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={form.name}
                placeholder="Name"
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="rounded-l-none  rounded-r-md  focus:ring-white ring-white"
              />
            </div>
            <span className="text-[12px] text-slate-600 mt-2">
              Please fill in your name as per your official document. You can't
              reverse this process.
            </span>
            <Input
              value={form.email}
              placeholder="Email Address"
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              type="email"
            />
            <Input
              value={form.username}
              placeholder="Username"
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value,
                })
              }
            />
            <Input
              value={form.password}
              placeholder="Password"
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              type="password"
            />
            <Input
              value={form.mobile}
              placeholder="Mobile Number"
              onChange={(e) =>
                setForm({
                  ...form,
                  mobile: e.target.value,
                })
              }
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Date of birth</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <YearMonthPicker onChange={setDate} />
              </PopoverContent>
            </Popover>

            <Select
              onValueChange={(value) => setForm({ ...form, country_id: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="101">India</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
            {form.country_id == 101 && (
              <Select
                onValueChange={(value) => setForm({ ...form, state_id: value })}
              >
                <SelectTrigger
                  className="w-full"
                  disabled={form.country_id !== 101}
                >
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {states &&
                    states.length > 0 &&
                    form.country_id === 101 &&
                    states.map((item, index) => (
                      <SelectItem value={item.value} key={index}>
                        {item.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
            <p>Are you a college student?</p>
            <div className="flex space-x-5">
              <button
                type="button"
                className={cn(
                  "p-3 rounded-md border px-6",
                  form.student === "yes" && "bg-blue-400"
                )}
                onClick={() =>
                  setForm({
                    ...form,
                    student: "yes",
                  })
                }
              >
                <p>Yes</p>
              </button>
              <button
                type="button"
                className={cn(
                  "p-3 rounded-md border px-6",
                  form.student === "no" && "bg-blue-400"
                )}
                onClick={() =>
                  setForm({
                    ...form,
                    student: "no",
                  })
                }
              >
                <p>No</p>
              </button>
            </div>
            <Select
              onValueChange={(value) => setForm({ ...form, education: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    form.student === "yes"
                      ? "Current Enrollment"
                      : "Highest Degree"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"Post Doctoral Fellowship"}>
                  {"Post Doctoral Fellowship"}
                </SelectItem>
                <SelectItem value={"PHD"}>{"PHD"}</SelectItem>
                <SelectItem value={"Masters Degree"}>
                  {"Masters Degree"}
                </SelectItem>
                <SelectItem value={"Bachelors Degree"}>
                  {"Bachelors Degree"}
                </SelectItem>
                <SelectItem value={"Secondary School"}>
                  {"Secondary School"}
                </SelectItem>
              </SelectContent>
            </Select>
            {form.student === "yes" && (
              <>
                <Input
                  value={form.college}
                  placeholder="College"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      college: e.target.value,
                    })
                  }
                />
                <Input
                  value={form.university}
                  placeholder="University"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      university: e.target.value,
                    })
                  }
                />
                <div className="flex space-x-4">
                  <Input
                    value={form.yearOfPassing}
                    placeholder="Year of Passing"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        yearOfPassing: e.target.value,
                      })
                    }
                  />
                  <Select
                    onValueChange={(value) =>
                      setForm({ ...form, monthOfPassing: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Month of Passing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="January">January</SelectItem>
                      <SelectItem value="February">February</SelectItem>
                      <SelectItem value="March">March</SelectItem>
                      <SelectItem value="April">April</SelectItem>
                      <SelectItem value="May">May</SelectItem>
                      <SelectItem value="June">June</SelectItem>
                      <SelectItem value="July">July</SelectItem>
                      <SelectItem value="August">August</SelectItem>
                      <SelectItem value="September">September</SelectItem>
                      <SelectItem value="October">October</SelectItem>
                      <SelectItem value="November">November</SelectItem>
                      <SelectItem value="December">December</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <CustomButton
              isLoading={isLoading}
              handlePress={submitForm}
              containerStyle="mt-4 w-full"
              title="Submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
