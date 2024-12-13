import { AgGridReact } from "ag-grid-react";

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

export default function Index() {
  return (
    <div>
      {" "}
      <AgGridReact rowData={rowData} columnDefs={colDefs} />
    </div>
  );
}
