import { LoaderFunctionArgs } from "@remix-run/node";
import { AgGridReact } from "ag-grid-react";
import { db } from "~/db";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { userId } = params;

  // Use an aggregation query to calculate the total area
  const harvestArea = await db.orchardTable.aggregate({
    where: { userId },
    _sum: { area: true }, // Summing the 'area' field
  });
  return { userId, harvestArea };
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

export default function Index() {
  return (
    <div>
      {/*  {" "}
      <AgGridReact rowData={rowData} columnDefs={colDefs} /> */}
    </div>
  );
}
