import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { Form } from "@remix-run/react";
import { useRemixForm } from "remix-hook-form";
import { createHeaderCookies, createNewTokens } from "~/auth";
import { db } from "~/db";
export async function loader() {
  return {};
}

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await db.userTable.findFirst({
    where: {
      email: "user320@example.com",
    },
  });

  console.log(user);

  const { accessToken, refreshToken } = await createNewTokens(
    "001a34f9-8607-4a48-aba2-0b1a07a90c44"
  );
  console.log("form");
  const headers = createHeaderCookies(accessToken, refreshToken);
  return redirect("/dashboard", { headers });
}
export default function Index() {
  const formMethods = useRemixForm<{ email: string; password: string }>({
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
    stringifyAllValues: true,
  });
  const { handleSubmit } = formMethods;

  return (
    <div className="flex h-full w-full items-center justify-center">
      {/*   <HookForm
          formMethods={formMethods}
          onSubmit={handleSubmit}
          method="POST"
          className="flex flex-col gap-4 rounded border p-8 shadow"
        >
          <InputField label="Email" name="email" />
          <InputField label="Lozinka" name="password" />
  
          <button type="submit" className="rounded bg-slate-200 p-4">
            {t('login')}
          </button>
        </HookForm> */}
      <Form
        method="post"
        className="flex flex-col gap-4 rounded border p-6 shadow bg-lime-700 text-white justify-center items-center"
        onSubmit={handleSubmit}
      >
        <span className="font-bold text-4xl">OLIO</span>
        <label htmlFor="email">Email</label>
        <input
          className="rounded border-slate-200 outline-none text-black"
          name="email"
          type="email"
        />
        <label htmlFor="password">Lozinka</label>
        <input
          className="rounded border-slate-200 outline-none text-black"
          name="password"
          type="password"
        />
        <div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Prijavi se
          </button>{" "}
          <button
            type="submit"
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
