import {
  Outlet,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { ColDef } from "node_modules/ag-grid-community/dist/types/src/entities/colDef";
import { useMemo } from "react";
import { AgGrid } from "~/components/AgGrid";

import { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "~/db";

export async function loader({ params }: LoaderFunctionArgs) {
  const { userId } = params;

  const harvestData = await db.harvestTable.findMany({
    where: { orchardUserId: userId },
  });

  return { harvestData };
}

export default function Index() {
  const navigate = useNavigate();
  const submit = useSubmit();
  // Define column definitions for AgGrid
  const { harvestData } = useLoaderData<typeof loader>();
  const colDefs = useMemo<ColDef<(typeof harvestData)[0]>[]>(
    () => [
      { field: "year", headerName: "Year" },
      { field: "quantity", headerName: "Quantity" },
      { field: "quality", headerName: "Quality" },

      {
        headerName: "",
        cellRenderer: (params: { data: (typeof harvestData)[0] }) => (
          <div className="flex h-full flex-row items-center gap-1 justify-end">
            {" "}
            <button
              className="bg-lime-700 text-white rounded hover:bg-lime-800 py-1 px-2 text-sm"
              onClick={() => navigate(params.data.id)}
            >
              EDIT
            </button>
            <button
              className="bg-red-700 text-white rounded hover:bg-red-800s py-1 px-2 text-sm"
              onClick={() =>
                submit(
                  {
                    id: params.data.id,
                  },
                  { method: "DELETE" }
                )
              }
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );
  return (
    <div className="flex flex-col p-5 w-full h-full">
      <div className="flex w-full justify-end my-3">
        <button
          className="rounded-md bg-lime-700 text-white hover:bg-lime-800 py-2 px-4"
          onClick={() => navigate("add")}
        >
          Add
        </button>
      </div>{" "}
      <AgGrid columnDefs={colDefs} rowData={harvestData} />
      <Outlet />
    </div>
  );
}
