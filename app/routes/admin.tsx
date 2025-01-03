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
    /*  console.log("User:", user); */
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
    <div className="bg-slate-50 flex flex-col text-black min-h-screen">
      <header className="flex items-center justify-between gap-8 border-b p-2 bg-lime-100">
        <h1 className="text-2xl">OLIO</h1>
        <button className="rounded-md bg-lime-700 text-white hover:bg-lime-800 p-2">
          Odjavi se
        </button>
      </header>
      <div className="flex flex-grow">
        <aside className="flex flex-col gap-2  bg-lime-100">
          <NavLink
            className={({ isActive }) =>
              ` uppercase p-4 ${isActive ? "bg-lime-700" : ""}`
            }
            to={`${params?.userId}/dashboard`}
          >
            dashboard
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `uppercase p-4 ${isActive ? "bg-lime-700" : ""}`
            }
            to={`${params?.userId}/orchards`}
          >
            orchards
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `uppercase p-4 ${isActive ? "bg-lime-700" : ""}`
            }
            to={`${params?.userId}/harvests`}
          >
            harvests
          </NavLink>
        </aside>
        <main className="flex flex-col justify-center items-center w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
