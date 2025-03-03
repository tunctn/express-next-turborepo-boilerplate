import { getUser } from "@/server/get-session";
import { redirect } from "next/navigation";

export default async function UnauthenticatedLayout({ children }: { children: React.ReactNode }) {
  const session = await getUser();
  if (session) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
