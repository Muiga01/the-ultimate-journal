import { redirect } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function RootPage() {
  // If already signed in, redirect to dashboard (handled client-side too)
  return redirect("/sign-in");
}
