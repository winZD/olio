import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, lazy } from "react";
import { AgGrid } from "~/components/AgGrid";
import FarmStatus from "~/components/FarmStatus";
import { db } from "~/db";
import { ClientOnly } from "remix-utils/client-only";
import PieChart from "~/components/PieChart";
import BarChart from "~/components/BarChart";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { userId } = params;

  const currentYear = new Date().getFullYear();

  const result = await db.$queryRaw<
    { totalArea: number; treeCount: number; totalQuantity: number }[]
  >`
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
    ) AS treeCount,
    COALESCE(
      (SELECT SUM(h.quantity)
       FROM Harvest h
       INNER JOIN Orchard o ON h.orchardId = o.id AND h.orchardUserId = o.userId
       WHERE o.userId = ${userId}),
      0
    ) AS totalQuantity
  `;

  // Step 1: Group data by location and sum quantities
  const groupedData = await db.harvestTable.groupBy({
    by: ["orchardId"],
    where: {
      orchard: {
        userId,
      },
      year: {
        /* lte: new Date(`${currentYear}-12-31`), // Harvests up to the current year */
        gte: currentYear, // Harvests from the start of the current year
        lte: currentYear, // Harvests up to the end of the current year
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
  });

  // Step 2: Fetch orchard locations for the grouped orchardIds
  const orchardLocations = await db.orchardTable.findMany({
    where: {
      id: {
        in: groupedData.map((data) => data.orchardId),
      },
    },
    select: {
      id: true,
      location: true,
    },
  });

  // Destructure all three properties from the first result
  const { totalArea, treeCount, totalQuantity } = result[0];

  const percentages = groupedData.map((item) => {
    const orchardLocation = orchardLocations.find(
      (orchard) => orchard.id === item.orchardId
    );
    return {
      id: orchardLocation?.id,
      location: orchardLocation?.location || "Unknown", // Default to "Unknown" if no location is found
      percentage: (((item._sum.quantity || 0) / totalQuantity) * 100).toFixed(
        2
      ),
    };
  });

  const yearlyProduction = await db.harvestTable.groupBy({
    by: ["year"],
    where: { orchard: { userId } },
    _sum: { quantity: true },
    orderBy: { year: "asc" },
  });

  console.log(yearlyProduction);
  return {
    userId,
    totalArea,
    treeCount,
    totalQuantity,
    percentages,
    yearlyProduction,
  };
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
  const {
    userId,
    totalArea,
    treeCount,
    totalQuantity,
    percentages,
    yearlyProduction,
  } = useLoaderData<typeof loader>();

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
      <FarmStatus
        area={totalArea}
        trees={Number(treeCount)}
        production={Number(totalQuantity.toFixed(2))}
      />

      <ClientOnly fallback={<div>Loading...</div>}>
        {() => (
          <div className="flex w-full">
            <div>
              <PieChart data={percentages} />
            </div>
            <div>
              <BarChart data={yearlyProduction} />{" "}
            </div>
          </div>
        )}
      </ClientOnly>

      <div className="flex flex-col h-96 p-5 bg-white w-full">
        <AgGrid columnDefs={colDefs} rowData={rowData} />
      </div>
    </>
  );
}
