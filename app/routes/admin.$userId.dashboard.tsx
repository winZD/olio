import { useState } from "react";
import { AgGrid } from "~/components/AgGrid";

export const loader = async () => {
  return { ok: true };
};
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
  const [rowData, setRowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState<{ field: string }[]>([
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" },
  ]);

  return (
    <>
      <div className="flex flex-col flex-1 p-5 bg-white w-full">
        <AgGrid columnDefs={colDefs} rowData={rowData} />
      </div>
    </>
  );
}
