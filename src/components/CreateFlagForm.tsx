import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateFlagMutation } from "../hooks/flags";
import { NewFlag } from "../types";

export default function CreateFlagForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const schema = z.object({
    title: z.string().trim().min(1, { message: "Flag name is required" }),
    f_key: z.string().trim().min(1, { message: "Flag key is required" }),
    description: z.string().optional(),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { mutateAsync } = useCreateFlagMutation();

  return (
    <form
      onSubmit={handleSubmit((d) => {
        const newFlag = d as NewFlag;
        mutateAsync(newFlag);
        setOpen(false);
      })}
      className="flex flex-col gap-3"
    >
      <div className="flex-col flex sm:flex-row gap-3">
        <div className="w-full">
          <label
            htmlFor="title"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Flag Name
          </label>
          <div className="mt-2">
            <input
              {...register("title")}
              type="text"
              name="title"
              id="title"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter a flag name"
            />
            {errors.title?.message && (
              <p>{errors.title?.message as ReactNode}</p>
            )}
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="f_key"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Flag Key
          </label>
          <div className="mt-2">
            <input
              {...register("f_key")}
              type="text"
              name="f_key"
              id="f_key"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter a flag key"
            />
            {errors.f_key?.message && (
              <p>{errors.f_key?.message as ReactNode}</p>
            )}
          </div>
        </div>
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Description
        </label>
        <div className="mt-2">
          <textarea
            {...register("description")}
            rows={4}
            name="description"
            id="description"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Write an optional description about your flag"
          />
        </div>
      </div>
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
        >
          Save
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
