import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";

import { newFlagSchema } from "@/models/flags";
import { useCreateFlagMutation } from "@/hooks/flags";
import { NewFlag } from "@/types";

import ToastTUI from "@/components/ToastTUI";
import FormButton from "@/components/ui/FormButton";
import FormInput from "@/components/ui/FormInput";
import FormHeader from "@/components/ui/FormHeader";
import ButtonGroup from "@/components/ui/ButtonGroup";

function CreateFlagForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<NewFlag>({
    resolver: zodResolver(newFlagSchema),
  });

  const { mutateAsync } = useCreateFlagMutation();

  const onSubmit = handleSubmit((newFlag) => {
    try {
      setIsLoading(true);

      setTimeout(async () => {
        await mutateAsync(newFlag);
        setIsLoading(false);
        toast.custom(
          <ToastTUI
            type="success"
            message={`Flag with key ${newFlag.fKey} saved to database.`}
          />,
        );
        setOpen(false);
      }, 300);
    } catch (err: unknown) {
      setIsLoading(false);
      if (err instanceof AxiosError) {
        const responseError = err.response?.data.error;
        toast.custom(<ToastTUI type="error" message={responseError} />);
      }
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <FormHeader
        action="Create a Flag"
        directions="Define your flag. Note, the flag key will be used to identify your flag in the database and can not be updated once it's created."
      />
      <div className="flex-col flex sm:flex-row gap-3">
        <div className="w-full">
          <label
            htmlFor="title"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Flag Name
          </label>
          <div className="mt-2">
            <FormInput
              id="title"
              placeholder="Enter a flag name"
              register={register("title")}
              isError={!!errors.title}
              errorMessage={errors.title?.message}
            />
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
            <FormInput
              id="fKey"
              placeholder="Enter a flag key"
              register={register("fKey")}
              isError={!!errors.fKey}
              errorMessage={errors.fKey?.message}
            />
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
      <ButtonGroup groupType="create">
        <FormButton
          className="w-24"
          typeOfButton="cancel"
          type="button"
          text="Cancel"
          onClick={() => setOpen(false)}
        />
        <FormButton
          className="w-24"
          typeOfButton="confirm"
          type="submit"
          text={isLoading ? "Loading..." : "Save"}
        />
      </ButtonGroup>
    </form>
  );
}

export default CreateFlagForm;
