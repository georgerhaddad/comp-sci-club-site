"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/admin/login");
        },
      },
    });
  };

  return (
    <Button
      onClick={handleLogout}
      variant={"link"}
      className="text-sm text-muted-foreground transition-colors hover:text-foreground p-0"
    >
      Logout
    </Button>
  );
}
