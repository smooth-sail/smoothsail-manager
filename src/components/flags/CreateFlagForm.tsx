import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useCreateFlagMutation } from "@/hooks/flags";
import { NewFlag } from "@/types";
import { newFlagSchema } from "@/models/flags";
import FormButton from "@/components/ui/FormButton";
import toast from "react-hot-toast";
import ToastTUI from "../ToastTUI";
import { AxiosError } from "axios";

function CreateFlagForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<NewFlag>({
    resolver: zodResolver(newFlagSchema),
  });

  const { mutateAsync } = useCreateFlagMutation();

  const onSubmit = handleSubmit(async (newFlag) => {
    try {
      await mutateAsync(newFlag);
      toast.custom(
        <ToastTUI
          type="success"
          message={`Flag with key ${newFlag.fKey} saved to database.`}
        />,
      );
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const responseError = err.response?.data.error;
        toast.custom(<ToastTUI type="error" message={responseError} />);
      }
    }
    setOpen(false);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
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
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ss-blgr sm:text-sm sm:leading-6"
              placeholder="Enter a flag name"
            />
            {errors.title?.message && (
              <p>{errors.title?.message as ReactNode}</p>
            )}
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="fKey"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Flag Key
          </label>
          <div className="mt-2">
            <input
              {...register("fKey")}
              type="text"
              name="fKey"
              id="fKey"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ss-blgr sm:text-sm sm:leading-6"
              placeholder="Enter a flag key"
            />
            {errors.fKey?.message && <p>{errors.fKey?.message as ReactNode}</p>}
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
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ss-blgr sm:text-sm sm:leading-6"
            placeholder="Write an optional description about your flag"
          />
        </div>
      </div>
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <FormButton typeOfButton="confirm" type="submit" text="Save" />
        <FormButton
          typeOfButton="cancel"
          type="button"
          text="Cancel"
          onClick={() => setOpen(false)}
        />
      </div>
    </form>
  );
}

export default CreateFlagForm;
