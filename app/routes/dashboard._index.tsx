import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export async function loader({ request, params }: LoaderFunctionArgs) {
  return redirect("/login");
}

export default function Index() {
  return (
    <div className="bg-lime-50 h-screen">
      <header className="flex items-center justify-between gap-8 border-b p-2 bg-lime-100">
        <h1 className="text-2xl">OLIO</h1>
        <button className="rounded-md bg-lime-700 text-white hover:bg-lime-800 p-2">
          Odjavi se
        </button>
      </header>
      <main className="flex flex-col justify-center items-center">
        <Outlet />
      </main>
    </div>
  );
}
