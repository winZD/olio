import { LoaderFunctionArgs } from "@remix-run/node";
import { ColDef } from "ag-grid-community";
import { useMemo } from "react";
import { db } from "~/db";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { AgGrid } from "~/components/AgGrid";

export async function loader({ params }: LoaderFunctionArgs) {
  const { userId } = params;

  // Orchard data with tree details
  /*   const orchardData = await db.orchardTable.findMany({
    where: { userId },
    include: { trees: true },
  }); */
  const orchards = await db.orchardTable.findMany({
    where: { userId },
    include: {
      trees: true,
      varieties: {
        select: {
          name: true,
        },
      },
    },
  });

  const orchardData = orchards.map((orchard) => ({
    id: orchard.id,
    name: orchard.name,
    area: orchard.area,
    location: orchard.location,
    soilType: orchard.soilType,
    irrigation: orchard.irrigation,
    trees: orchard.trees.length,
    varieties: orchard.varieties.length,
    varietyNames: orchard.varieties.map((v) => v.name).join(", "),
  }));
  return { orchardData };
}
export default function Index() {
  const navigate = useNavigate();

  // Define column definitions for AgGrid
  const { orchardData } = useLoaderData<typeof loader>();
  const colDefs = useMemo<ColDef<(typeof orchardData)[0]>[]>(
    () => [
      { field: "name", headerName: "Name" },
      { field: "area", headerName: "Area" },
      { field: "location", headerName: "Location" },
      { field: "soilType", headerName: "Soil Type" },
      { field: "trees", headerName: "Trees" },
      { field: "varieties", headerName: "Varieties" },
      {
        field: "varietyNames",
        headerName: "Variety names",
        tooltipField: "varietyNames",
      },
      { field: "irrigation", headerName: "Irrigation" },
      {
        headerName: "Actions",
        cellRenderer: (params: { data: typeof orchardData }) => (
          <div className="flex h-full flex-row items-center">
            {" "}
            <button
              className="bg-lime-700 text-white rounded hover:bg-lime-800 py-1 px-2 text-sm"
              onClick={() => console.log(params.data)}
            >
              EDIT
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
        {/*   <NavLink
          to="add"
          className="m-2 self-start rounded bg-blue-500 px-4 py-1 text-white hover:bg-blue-800"
        >
          Add
        </NavLink> */}

        <button
          className="rounded-md bg-lime-700 text-white hover:bg-lime-800 py-2 px-4"
          onClick={() => navigate("add")}
        >
          Add
        </button>
      </div>{" "}
      <AgGrid columnDefs={colDefs} rowData={orchardData} />
      <Outlet />
    </div>
  );
}
