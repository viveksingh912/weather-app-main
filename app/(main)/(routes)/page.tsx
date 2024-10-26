import Landing from "@/components/Landing";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { initialProfile } from "@/lib/initial-profile";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default async function HomePage() {
  const profile = await initialProfile();
  return (
   <Landing profile={profile}/>
  );
}
