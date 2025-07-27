"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authContext";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function GoogleLoginButton() {
  const { login } = useAuth();
  const router = useRouter();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const credential = tokenResponse.access_token;
        if (!credential) {
          toast.error("Google login failed. No credential.");
          return;
        }

        // Optionally fetch user profile using token if needed
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${credential}`,
          },
        });

        const profile = await res.json();
        console.log("Google profile:", profile);

        const email = profile.email;
        const username = profile.name;

        // Send to your backend
        const response = await fetch(`${API_BASE_URL}/api/Auth/google-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username }),
        });

        const data = await response.json();

        if (response.ok) {
          login(data.token, data.refreshToken);
          toast.success("Logged in with Google!");
          router.push("/");
        } else {
          toast.error(data.message || "Google login failed.");
        }
      } catch (err) {
        console.error("Google login error", err);
        toast.error("Google login error");
      }
    },
    onError: () => toast.error("Google Sign-In failed"),
    flow: "implicit", // or "auth-code" if you're exchanging server-side
  });

  return (
    <button
      type="button"
      onClick={() => googleLogin()}
      aria-label="Continue with Google"
      className="p-2 px-9 rounded-full bg-white shadow"
    >
      <FcGoogle className="w-4 h-4" />
    </button>
  );
}
