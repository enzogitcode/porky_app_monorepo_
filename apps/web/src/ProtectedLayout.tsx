import Header from "./ui/Header";
import { Outlet } from "react-router-dom";

export const ProtectedLayout = () => {
  return (
    <>
      <Header />
      <main className="">
        <Outlet />
      </main>
    </>
  );
};
