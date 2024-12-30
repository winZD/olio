import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import * as zod from "zod";
import { Modal } from "~/components/Modal";
import { db } from "~/db";

const schema = zod.object({
  name: zod.string().min(1),
  location: zod.string(),
  area: zod.string(),
  soilType: zod.string(),

  irrigation: zod.boolean(),
});

type FormData = zod.infer<typeof schema>;

export async function loader({ params }: LoaderFunctionArgs) {
  const { userId } = params;
  const varieties = await db.varietyTable.findMany({
    where: { orchardUserId: userId },
  });

  return { varieties };
}
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const schema = zod.object({
    name: zod.string().min(1),
    location: zod.string(),
    area: zod.string(),
    soilType: zod.string(),

    irrigation: zod.boolean(),
  });
  const resolver = zodResolver(schema);
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);
  console.log(data);
  if (errors) {
    // The keys "errors" and "defaultValues" are picked up automatically by useRemixForm
    console.log(errors);
    return { errors, defaultValues };
  }

  if (!data) {
    return null;
  }
  const orchard = await db.orchardTable.create({
    data: {
      name: data.name,
      location: data.location,
      area: Number(data.area),
      soilType: data.soilType,
      irrigation: data.irrigation,
      userId: params.userId!,
    },
  });

  return redirect(`../${orchard.id}`);
};
export default function Index() {
  const { varieties } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  /* const formMethods = useRemixForm<FormData>({
    mode: "onSubmit",
    // resolver,
    defaultValues: {
      name: "",
      location: "",
      area: "",
      soilType: "",

      irrigation: false,
    },
  }); */
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useRemixForm<FormData>({
    mode: "onSubmit",
  });
  return (
    <Modal title={"Add orchard"}>
      <Form
        method="POST"
        className="flex flex-col gap-4 rounded border p-6 shadow  justify-center items-center bg-slate-100"
        onSubmit={handleSubmit}
      >
        {" "}
        <div className="flex gap-4">
          <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label htmlFor="location">Name</label>
              <input id="name" className="rounded" {...register("name")} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                className="rounded"
                {...register("location")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="area">Area</label>
              <input id="area" className="rounded" {...register("area")} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="soilType">Soil type</label>
              <input
                id="soilType"
                className="rounded"
                {...register("soilType")}
              />
            </div>

            <div className="gap-2">
              <label htmlFor="irrigation">Irrigation</label>
              <input
                id="irrigation"
                type="checkbox"
                className="rounded"
                {...register("irrigation")}
              />
            </div>
          </div>
          {/*  <div className="flex flex-col gap-2">
            <label htmlFor="tree">Trees</label>
            <input id="tree" className="rounded" {...register("tree")} />
          </div> */}
          {
            <div className="flex flex-col gap-2">
              <label className="" htmlFor="variety">
                Variety
              </label>
              <div className="gap-4">
                {" "}
                <select id={"variety"} className=" rounded border-slate-200">
                  {varieties.map((option) => (
                    <option key={option.id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>{" "}
                <button
                  type="submit"
                  className=" bg-lime-700 text-white hover:bg-lime-800  font-bold  px-4 rounded"
                >
                  Add
                </button>{" "}
              </div>
            </div>
          }
        </div>
        <div>
          <button
            type="submit"
            className=" bg-lime-700 text-white hover:bg-lime-800  font-bold py-2 px-4 rounded"
          >
            Add
          </button>{" "}
          <button
            type="button"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate("..")}
          >
            Cancel
          </button>
        </div>{" "}
      </Form>
    </Modal>
  );
}
