import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { useFieldArray } from "react-hook-form";
import * as zod from "zod";
import { Modal } from "~/components/Modal";
import { db } from "~/db";
import { v4 as uuidv4 } from "uuid";

// Schema definition
const orchardSchema = zod.object({
  name: zod.string().min(1),
  location: zod.string(),
  area: zod.string(),
  soilType: zod.string(),
  varieties: zod.array(
    zod.object({
      id: zod.string(),
      orchardId: zod.string(),
      name: zod.string().min(1),
      treeNumber: zod.number().min(1),
    })
  ),
  irrigation: zod.boolean(),
});

type FormData = zod.infer<typeof orchardSchema>;

// Loader function
export async function loader({ params }: LoaderFunctionArgs) {
  const { userId } = params;
  const varieties = await db.varietyTable.findMany({
    where: { orchardUserId: userId },
  });
  return { varieties };
}

// Action function
export const action = async ({ request }: ActionFunctionArgs) => {
  const resolver = zodResolver(orchardSchema);
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);

  if (errors) {
    console.error(errors);
    return { errors, defaultValues };
  }

  if (!data) return null;

  /*  const orchard = await db.orchardTable.create({
    data: {
      name: data.name,
      location: data.location,
      area: Number(data.area),
      soilType: data.soilType,
      irrigation: data.irrigation,
      userId: params.userId!,
    },
  }); */

  return {};
};

// Component for Orchard Form
export default function OrchardForm() {
  const params = useParams();
  console.log(params);
  /*  const { varieties } = useLoaderData<typeof loader>(); */
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver: zodResolver(orchardSchema),
    defaultValues: {
      name: "",
      location: "",
      area: "",
      soilType: "",
      irrigation: false,
      varieties: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "varieties",
  });

  return (
    <Modal title="Add Orchard">
      <Form
        method="POST"
        className="flex flex-col gap-4 rounded border p-6 shadow justify-center items-center bg-slate-100"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-4">
          <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Name</label>
              <input id="name" className="rounded" {...register("name")} />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                className="rounded"
                {...register("location")}
              />
              {errors.location && (
                <span className="text-red-500">{errors.location.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="area">Area</label>
              <input id="area" className="rounded" {...register("area")} />
              {errors.area && (
                <span className="text-red-500">{errors.area.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="soilType">Soil Type</label>
              <input
                id="soilType"
                className="rounded"
                {...register("soilType")}
              />
              {errors.soilType && (
                <span className="text-red-500">{errors.soilType.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="irrigation">Irrigation</label>
              <input
                id="irrigation"
                type="checkbox"
                className="rounded"
                {...register("irrigation")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 border">
            <button
              type="button"
              className="bg-green-500 text-white px-4 rounded"
              onClick={() =>
                append({
                  id: uuidv4(),
                  orchardId: params.orchardId as string,
                  name: "",
                  treeNumber: 0,
                })
              }
            >
              Add Variety
            </button>

            <label htmlFor="varieties">Varieties</label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 justify-evenly">
                <span>{`${index + 1 + "."}`}</span>
                <input
                  className="rounded"
                  placeholder="Variety Name"
                  {...register(`varieties.${index}.name`)}
                />
                <input
                  className="rounded"
                  placeholder="Variety Name"
                  {...register(`varieties.${index}.treeNumber`)}
                />
                <button
                  type="button"
                  className="bg-red-500 text-white px-2 rounded"
                  onClick={() => remove(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-lime-700 text-white hover:bg-lime-800 font-bold py-2 px-4 rounded"
          >
            Add
          </button>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate("..")}
          >
            Cancel
          </button>
        </div>
      </Form>
    </Modal>
  );
}
