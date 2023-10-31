import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useUpdateFlagMutation } from "@/hooks/flags";
import { Flag } from "@/types";
import { flagUpdatesSchema } from "@/models/flags";
import FormButton from "@/components/ui/FormButton";
import { formatDateTime } from "@/utils/format";

type UpdateFlagFormProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & Flag;

function UpdateFlagForm({ setOpen, ...props }: UpdateFlagFormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Flag>({
    resolver: zodResolver(flagUpdatesSchema),
    defaultValues: {
      title: props.title,
      description: props.description,
    },
  });

  const { mutateAsync: updateFlagMutation } = useUpdateFlagMutation();

  const onSubmit = handleSubmit((bodyUpdates) => {
    const flagUpdates = {
      ...bodyUpdates,
      fKey: props.fKey,
    };
    updateFlagMutation(flagUpdates);
    setOpen(false);
  });

  return (
    <>
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
            <p className="block text-sm font-medium leading-6 text-gray-900">
              Flag Key
            </p>
            <div className="mt-2">
              <span className="block w-full rounded-md border-0 p-1.5 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                {props.fKey}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-col flex sm:flex-row gap-3">
          <div className="w-full">
            <p className="block text-sm font-medium leading-6 text-gray-900">
              Created At
            </p>
            <div className="mt-2">
              <span className="block w-full rounded-md border-0 p-1.5 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                {formatDateTime(props.createdAt)}
              </span>
            </div>
          </div>
          <div className="w-full">
            <p className="block text-sm font-medium leading-6 text-gray-900">
              Updated At
            </p>
            <div className="mt-2">
              <span className="block w-full rounded-md border-0 p-1.5 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                {formatDateTime(props.updatedAt)}
              </span>
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
    </>
  );
}

export default UpdateFlagForm;
