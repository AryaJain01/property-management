import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardRedirect() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const role = (session.user as any).role

  if (role === "TENANT") redirect("/dashboard/tenant")
  if (role === "OWNER") redirect("/dashboard/owner")
  if (role === "ADMIN") redirect("/dashboard/admin")
  
  return (
    <div className="flex justify-center py-20">Loading dashboard...</div>
  )
}
