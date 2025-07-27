"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authContext";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function FacebookCallbackPage() {
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("access_token")) {
      // Silently redirect to login without showing error toast
      router.replace("/Login_Register/Login");
      return;
    }

    const params = new URLSearchParams(hash.replace("#", ""));
    const accessToken = params.get("access_token");
    const error = params.get("error");

    if (error) {
      toast.error("Facebook login was cancelled or failed.");
      router.replace("/Login_Register/Login");
      return;
    }

    if (!accessToken) {
      router.replace("/Login_Register/Login");
      return;
    }

    const loginWithFacebook = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/Auth/facebook-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accessToken }),
        });

        const data = await res.json();

        if (res.ok) {
          login(data.token, data.refreshToken);
          toast.success("Logged in with Facebook!");
          router.push("/");
        } else {
          toast.error(data.message || "Login failed");
          router.replace("/Login_Register/Login");
        }
      } catch (err) {
        toast.error("Network error during Facebook login");
        router.replace("/Login_Register/Login");
      }
    };

    loginWithFacebook();
  }, [login, router]);

  return (
    <div className="h-screen flex items-center justify-center text-lg text-gray-700">
      Logging you in with Facebook...
    </div>
  );
}
