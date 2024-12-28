import { Form, useNavigate } from "@remix-run/react";
import { Modal } from "~/components/Modal";

export default function Index() {
  const navigate = useNavigate();
  return (
    <Modal title={"Add orchard"}>
      <Form
        method="POST"
        className="flex flex-col gap-4 rounded border p-6 shadow  justify-center items-center bg-slate-100"
        /*    onSubmit={handleSubmit} */
      >
        {" "}
        {/*    <span className="font-bold text-4xl">OLIO</span> */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="location">Name</label>
            <input
              id="name"
              className="rounded"
              name="name"
              /*   {...register("email")} */
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="location">Location</label>
            <input id="location" name="location" className="rounded" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="area">Area</label>
            <input id="area" name="area" className="rounded" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="soilType">Soil type</label>
            <input id="soilType" name="soilType" className="rounded" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tree">Tree</label>
            <input id="tree" name="tree" className="rounded" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="variety">Variety</label>
            <input id="variety" className="rounded" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="harvest">Harvest</label>
            <input id="harvest" name="harvest" className="rounded" />
          </div>
          <div className="gap-2">
            <label htmlFor="irrigation">Irrigation</label>
            <input
              id="irrigation"
              name="irrigation"
              type="checkbox"
              className="rounded"
            />
          </div>
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
