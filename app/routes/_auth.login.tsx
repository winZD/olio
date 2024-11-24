import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@remix-run/react";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { createHeaderCookies, createNewTokens } from "~/auth";
import { db } from "~/db";
import { parse } from "cookie";

const schema = zod.object({
  email: zod.string().min(1),
  password: zod.string().min(1),
});
type FormData = zod.infer<typeof schema>;

export async function action({ request }: ActionFunctionArgs) {
  const schema = zod.object({
    email: zod.string().min(1),
    password: zod.string().min(1),
  });
  type FormData = zod.infer<typeof schema>;

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
    return defaultValues;
  }

  if (!data) {
    return null;
  }

  const user = await db.userTable.findFirst({
    where: {
      email: data.email,
    },
  });

  console.log(user);
  if (!user) {
    return null;
  }
  const { accessToken, refreshToken } = await createNewTokens(
    user?.id as string
  );

  // const isValid = await bcrypt.compare(data.password, user.password);

  const headers = createHeaderCookies(accessToken, refreshToken);
  return redirect("/dashboard", { headers });
}
export default function Index() {
  const resolver = zodResolver(schema);
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
  });

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Form
        method="POST"
        className="flex flex-col gap-4 rounded border p-6 shadow bg-lime-700 text-white justify-center items-center"
        onSubmit={handleSubmit}
      >
        <span className="font-bold text-4xl">OLIO</span>
        <label htmlFor="email">Email</label>
        <input
          className="rounded border-slate-200 outline-none text-black"
          type="text"
          {...register("email")}
        />
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
        <label htmlFor="password">Lozinka</label>
        <input
          className="rounded border-slate-200 outline-none text-black"
          type="password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-600">{errors.password.message}</p>
        )}
        <div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Prijavi se
          </button>{" "}
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Registriraj se
          </button>
        </div>{" "}
        <span>Promijeni lozinku</span>
      </Form>
    </div>
  );
}
