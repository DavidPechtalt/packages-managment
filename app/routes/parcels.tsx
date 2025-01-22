import type { Parcel } from "~/types/parcel";
import parcelsData from "../data/parcels.json";
import {
  Link,
  Outlet,
  redirect,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { FormEvent } from "react";
import { ActionFunctionArgs } from "@remix-run/node";
import { pickParcel } from "~/data/parcelsData";

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.formData();
  const id = data.get("status-id");
  const startDate = data.get("start-date")
  console.log(startDate)
  if (!id || typeof id !== "string") {
    return Response.json({ error: "id issue" }, { status: 400 });
  }
  if (!pickParcel(id)) {
    return Response.json({ error: "wrong parcel id" }, { status: 400 });
  }

  return redirect(".");
}
export function loader() {
  const parcels = parcelsData as Parcel[];
  return parcels;
}

export default function Parcels() {
  const parcels: Parcel[] = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#071333]">
      <div className="flex-grow"></div>
      <div className="w-[90%] max-w-[90%] min-w-[90%] flex justify-between mb-7 ">
        <div className="flex  space-x-5 items-end">
          <div>
            {" "}
            <fetcher.Form className="flex flex-col" method="get">
              <label
                className="text-white text-sm mb-1 ml-2"
                htmlFor="start-date"
              >
                start date
              </label>
              <input
                name="start-date"
                id="start-date"
                type="date"
                className="rounded-lg w-40 px-2 h-8 "
                onChange={(e) => e.target.form?.submit()}
              />
            </fetcher.Form>
          </div>
          <div>
            <fetcher.Form className="flex flex-col">
              {" "}
              <div className="text-white text-sm mb-1 ml-2">end date</div>
              <input type="date" className="rounded-lg w-40 px-2 h-8" />
            </fetcher.Form>
          </div>
          <div>
            <fetcher.Form className="flex flex-col">
              <div className="text-white text-sm mb-1 ml-2">status</div>
              <select defaultValue="" className="rounded-lg w-40 px-2 h-8">
                <option value="">--status--</option>
                <option>picked</option>
                <option>pending</option>
              </select>
            </fetcher.Form>
          </div>
          <div>
            {" "}
            <fetcher.Form className="flex flex-col">
              <div className="text-white text-sm mb-1 ml-2">property</div>
              <select defaultValue="" className="rounded-lg w-40 px-2 h-8">
                <option value="">--building--</option>
                <option>High Street 34</option>
                <option>Prince Consort 22</option>
              </select>
            </fetcher.Form>
          </div>
        </div>
        <div className="h-8 bg-orange-500 mt-6 px-2  min-w-fit flex justify-center items-center text-white rounded-lg">
          {" "}
          <Link to={`./new`}> New Package</Link>
        </div>
      </div>
      {<Table parcels={parcels} />}
      <Outlet context={parcels} />
      <div className="h-1"></div>
    </div>
  );
}

export function Table({ parcels }: { parcels: Parcel[] }) {
  return (
    <div className="max-w-[90%]   overflow-x-auto flex flex-col  scrollbar py-2 h-[65%]">
      <div className="min-w-[1650px] flex w-[1450px] min-h-14 h-14 px-4  mb-4 rounded-lg text-white text-lg bg-black">
        {" "}
        <div className="flex items-center min-w-[214px] ">
          <div className="w-[100%]">Resident</div>
        </div>
        <div className="flex items-center min-w-[214px] ">
          <div className="w-[100%]">Property/Unit</div>
        </div>
        <div className="flex ml-6 items-center min-w-[214px] ">
          <div className="w-[100%] ">ID</div>
        </div>
        <div className="flex ml-8 items-center min-w-[150px] ">
          <div className="w-[100%]">Courier</div>
        </div>
        <div className="flex items-center min-w-[214px] ">
          <div className="w-[100%]">Arrived on</div>
        </div>
        <div className="flex ml-9 items-center min-w-[214px] ">
          <div className="w-[100%]">Status</div>
        </div>
        <div className="flex items-center min-w-[214px] ">
          <div className="w-[100%]">Pick</div>
        </div>
        <div className="flex items-center  min-w-[214px]">
          <div className="w-[100%]">Edit</div>
        </div>
      </div>
      <div className=" w-fit overflow-y-auto scrollbar flex-grow">
        {parcels.map((parcel) => {
          return <TableRow key={parcel.id} parcel={parcel} />;
        })}
      </div>
    </div>
  );
}

export function TableRow({ parcel }: { parcel: Parcel }) {
  const fetcher = useFetcher();
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    if (!confirm("Are you picking the package?")) {
      e.preventDefault();
    }
  }
  return (
    <div className="  min-w-[1650px] w-[1650px] max-w-[1650px] h-20 rounded-lg bg-white flex items-center mr-2 px-4 text-gray-500 mb-1.5 overflow-x-hidden">
      <div className="flex items-center min-w-[214px]">
        <img
          className="rounded-full h-10 "
          src={parcel.resident.img.src}
          alt={parcel.resident.img.alt}
        ></img>
        <div className="ml-3">{parcel.resident.name}</div>
      </div>
      <div className="flex items-center min-w-[214px] ">
        <div className="w-[100%]">
          <div>{parcel.resident.unit.number}</div>
          <div>{parcel.resident.unit.street} </div>
        </div>
      </div>
      <div className="flex items-center  min-w-[214px] ml-6">{parcel.id} </div>
      <div className="flex items-center  min-w-[150px] ml-8">
        {parcel.courier}
      </div>
      <div className="flex items-center  min-w-[214px]">
        {parcel.arrivedIn.split("T")[0]}
      </div>
      <div className="flex items-center ml-9  min-w-[214px]">
        <div
          className={`rounded-xl w-20 flex justify-center  ${
            parcel.status === "pending" ? "bg-red-200" : "bg-green-200"
          }  py-0.5`}
        >
          {parcel.status}
        </div>
      </div>
      <div className="flex items-center min-w-[200px]">
        <fetcher.Form onSubmit={(e) => handleSubmit(e)} method="post">
          {" "}
          <button
            name="status-id"
            value={parcel.id}
            disabled={parcel.status === "picked up"}
            className="disabled:opacity-50"
          >
            <img alt="v" src="/vee.png" className="h-8  rounded-full "></img>
          </button>
        </fetcher.Form>{" "}
      </div>
      <div className="flex items-center min-w-[200px]">
        <Link to={`./${parcel.id}/edit`}>Edit</Link>
      </div>
    </div>
  );
}
