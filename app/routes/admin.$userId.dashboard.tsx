import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { AgGrid } from "~/components/AgGrid";
import FarmStatus from "~/components/FarmStatus";
import { db } from "~/db";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { userId } = params;

  const result = await db.$queryRaw<{ totalArea: number; treeCount: number }[]>`
    SELECT 
      COALESCE(
        (SELECT SUM(o.area)
         FROM Orchard o
         WHERE o.userId = ${userId}), 
        0
      ) AS totalArea,
      COALESCE(
        (SELECT COUNT(t.id)
         FROM Tree t
         INNER JOIN Orchard o ON t.orchardId = o.id AND t.orchardUserId = o.userId
         WHERE o.userId = ${userId}),
        0
      ) AS treeCount
  `;

  console.log(result);
  const { totalArea, treeCount } = result[0];
  return { userId, totalArea, treeCount };
}

const columnDefs = [
  {
    headerName: "Orchard Name",
    field: "name",
    sortable: true,
    filter: true,
    width: 200,
  },
  {
    headerName: "Location",
    field: "location",
    sortable: true,
    filter: true,
    width: 150,
  },
  {
    headerName: "Area (hectares)",
    field: "area",
    sortable: true,
    filter: true,
    width: 150,
  },
  {
    headerName: "Soil Type",
    field: "soilType",
    sortable: true,
    filter: true,
    width: 120,
  },
  {
    headerName: "Irrigation",
    field: "irrigation",
    sortable: true,
    filter: true,
    width: 120,
  },
];
interface ICar {
  make: string;
  model: string;
  price: number;
}
export default function Index() {
  const { userId, totalArea, treeCount } = useLoaderData<typeof loader>();

  const [rowData, setRowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ]);
  console.log(treeCount);
  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState<{ field: string }[]>([
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" },
  ]);

  return (
    <>
      <FarmStatus area={totalArea} trees={Number(treeCount)} production={0} />
      <div className="flex flex-col flex-1 p-5 bg-white w-full">
        <AgGrid columnDefs={colDefs} rowData={rowData} />
      </div>
    </>
  );
}
