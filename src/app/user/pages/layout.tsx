"use client"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AppSidebar from "@/components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const logoutfeature = async()=>{
    try {
      const response = await axios.get('/api/user/logout');
      if(response.status===200){
        console.log('successfully logged out!!!');
        toast.success('successfully logged out!!!')
        router.push('/user/auth/login')
      }else{
        toast.error('Failed to logout!!')
      }
    } catch (error) {
      console.log('something went wrong!!!'+error);
    }
  }
  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <nav className="bg-zinc-900 text-white shadow-lg flex items-center p-4 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="font-bold text-2xl">ProGenie</div>
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
              
                <div>
                  <Dialog>
                  <DialogTrigger>Logout</DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Logout</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to Logout?
                        <div className="flex justify-around items-center m-3">
                          <Button variant={'destructive'} onClick={logoutfeature} className="cursor-pointer">Logout</Button>
                          <DialogClose><Button className="bg-green-500 text-white">Cancel</Button></DialogClose>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                </div>

             
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