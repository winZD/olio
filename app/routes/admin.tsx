import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { NavLink, Outlet, useParams } from "@remix-run/react";
import { parse } from "cookie";
import { getUserFromRequest } from "~/auth";
import { db } from "~/db";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookies = await parse(cookieHeader || "");
  /*   console.log(cookies); */

  // Fetch the user from the request
  const user = await getUserFromRequest(request);

  // Check if the user exists in the database
  if (user) {
    const existedUser = await db.userTable.findUniqueOrThrow({
      where: { email: user.email },
    });
    console.log("User:", user);
    if (existedUser) {
      return { existedUser };
    }
  }
  return redirect("/login");
}

export default function Index() {
  const params = useParams();

  console.log(params);
  return (
    <div className="bg-lime-50 flex flex-col text-black min-h-screen">
      <header className="flex items-center justify-between gap-8 border-b p-2 bg-lime-100">
        <h1 className="text-2xl">OLIO</h1>
        <button className="rounded-md bg-lime-700 text-white hover:bg-lime-800 p-2">
          Odjavi se
        </button>
      </header>
      <div className="flex flex-grow bg-red-800">
        <aside className="flex flex-col gap-3 p-8 bg-white ">
          <NavLink className={"uppercase"} to={`${params?.userId}/dashboard`}>
            dashboard
          </NavLink>
          <NavLink className={"uppercase"} to={`${params?.userId}/orchards`}>
            orchards
          </NavLink>
        </aside>
        <main className="flex flex-col justify-center items-center h-full w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
