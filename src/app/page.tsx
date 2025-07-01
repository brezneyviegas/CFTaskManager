"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TodoList from "@/components/todo-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Rocket } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      router.replace("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  if (!isClient || !isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Rocket className="h-16 w-16 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading TaskMaster...</p>
        </div>
      </div>
    );
  }

  return <TodoList />;
}
