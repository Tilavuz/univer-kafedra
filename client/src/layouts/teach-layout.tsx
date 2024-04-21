import TeachHeader from "@/components/teach-header";
import { Outlet } from "react-router-dom";

export default function TeachLayout() {
  return (
    <>
        <TeachHeader />
        <div className="min-h-full pt-[100px]">
          <Outlet />
        </div>
    </>
  )
}
