import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="bg-lime-50 h-full">
      <header className="flex items-center justify-between gap-8 border-b p-2 ">
        <h1 className="text-2xl">OLIO</h1>
        <button className="rounded-md bg-lime-700 text-white hover:bg-lime-800 p-2">
          Prijavi se
        </button>
      </header>
      <main className="flex flex-col justify-center items-center">
        <div className="text-5xl">Dobrodošli u olio</div>
      </main>
    </div>
  );
}
