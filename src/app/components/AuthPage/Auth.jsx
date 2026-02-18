"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cmnApi } from "@/utils/cmnapi";
import toast from "react-hot-toast";

const Auth = () => {
  const router = useRouter();
  const [tab, setTab] = useState("register"); // 'register' or 'login'
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      setForm({
        ...form,
        [name]: value.replace(/[^a-zA-Z\s]/g, "").slice(0, 15),
      });
    } else if (name === "phone") {
      setForm({ ...form, [name]: value.replace(/\D/g, "").slice(0, 15) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validateRegister = () => {
    if (!/^[a-zA-Z\s]{2,15}$/.test(form.name)) {
      toast.error("Please enter a valid name.");
      return false;
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (!/^[0-9]{6,15}$/.test(form.phone)) {
      toast.error("Phone number must be 6-15 digits.");
      return false;
    }
    if (!form.password) {
      toast.error("Password is required.");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (!form.password) {
      toast.error("Password is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tab === "register" && !validateRegister()) return;
    if (tab === "login" && !validateLogin()) return;

    setLoading(true);
    try {
      if (tab === "register") {
        await cmnApi.post("/api/auth/register/editor", form);
        toast.success("Registration successful! Please login.");
        setTab("login");
        setForm({ name: "", email: "", phone: "", password: "" });
      } else {
        const response = await cmnApi.post("/api/auth/login", {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("userToken", response.token); // Save token
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(
        tab === "register" ? "Registration failed:" : "Login failed:",
        error,
      );
      // Toast shows backend message automatically
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (newTab) => {
    setTab(newTab);
    if (newTab === "login")
      setForm((prev) => ({ ...prev, name: "", phone: "" }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f2a56] via-[#163b73] to-[#1e4b8f]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-center text-2xl font-extrabold text-gray-900">
          ગુજરાત ન્યૂઝ
        </h1>
        <p className="text-center text-sm text-gray-500 mt-1">
          {tab === "register" ? "Editor Registration" : "Editor Login"}
        </p>

        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={() => switchTab("register")}
            className={`px-4 py-2 rounded-full font-semibold ${tab === "register" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Register
          </button>
          <button
            onClick={() => switchTab("login")}
            className={`px-4 py-2 rounded-full font-semibold ${tab === "login" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {tab === "register" && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <input
                type="text"
                name="phone"
                placeholder="Enter 10-digit phone number"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="editor@gujaratnews.com"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter a secure password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition cursor-pointer ${loading ? "bg-gray-400" : "bg-[#132e5c] hover:bg-[#0f254a]"}`}
          >
            {tab === "register" ? "Register" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
