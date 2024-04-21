import Header from "@/components/header";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <>
        <Header />
        <div className="min-h-full pt-[100px]">
          <Outlet />
        </div>
    </>
  )
}
