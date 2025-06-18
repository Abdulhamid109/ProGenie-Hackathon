import { AppSidebar } from "@/components/Navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <nav className="bg-zinc-900 text-white shadow-lg flex items-center p-4 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="font-bold text-2xl">Logo</div>
            <div className="flex-1"></div>
            <div className="flex items-center space-x-4">
              <Link href="#" className="p-2">
                <div className="w-8 h-8 bg-green-600 rounded-full hover:bg-green-700 transition"></div>
              </Link>
              <Link
                href="#"
                className="p-2 text-sm font-medium hover:bg-zinc-700 hover:rounded-md transition"
              >
                Notifications
              </Link>
              <Link
                href="#"
                className="p-2 text-sm font-medium hover:bg-zinc-700 hover:rounded-md transition"
              >
                About Us
              </Link>
              <Link
                href="#"
                className="p-2 text-sm font-medium hover:bg-red-600 hover:rounded-md transition"
              >
                Logout
              </Link>
            </div>
          </nav>
          <div className="p-2 flex-1">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}