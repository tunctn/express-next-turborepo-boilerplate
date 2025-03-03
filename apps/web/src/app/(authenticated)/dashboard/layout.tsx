import { getUser } from "@/server/get-session";
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const session = await getUser();

  if (!session) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}
