import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";

import { useDeleteFlagMutation, useUpdateFlagMutation } from "@/hooks/flags";
import { flagUpdatesSchema } from "@/models/flags";
import { formatDateTime } from "@/utils/format";
import { Flag } from "@/types";

import ToastTUI from "@/components/ToastTUI";
import FormButton from "@/components/ui/FormButton";
import FormInput from "@/components/ui/FormInput";
import FormHeader from "@/components/ui/FormHeader";
import DeleteModal from "@/components/DeleteModal";
import ButtonGroup from "@/components/ui/ButtonGroup";

type UpdateFlagFormProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & Flag;

function UpdateFlagForm({ setOpen, ...props }: UpdateFlagFormProps) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

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

  const { mutateAsync: updateFlagBody } = useUpdateFlagMutation();

  const onSubmit = handleSubmit((bodyUpdates) => {
    try {
      setIsLoading(true);

      setTimeout(async () => {
        await updateFlagBody({
          ...bodyUpdates,
          fKey: props.fKey,
        });
        setIsLoading(false);
        toast.custom(
          <ToastTUI
            type="success"
            message={`Flag with key ${props.fKey} updated in the database.`}
          />,
        );
        setOpen(false);
      }, 100);
    } catch (err: unknown) {
      setIsLoading(false);
      if (err instanceof AxiosError) {
        const responseError = err.response?.data.error;
        toast.custom(<ToastTUI type="error" message={responseError} />);
      }
    }
  });

  const { mutateAsync: deleteFlagMutation } = useDeleteFlagMutation();
  const handleDelete = () => {
    try {
      setIsDeleteLoading(true);

      setTimeout(async () => {
        await deleteFlagMutation(props.fKey);
        toast.custom(
          <ToastTUI type="success" message="Flag deleted from the database." />,
        );
        setOpen(false);
      }, 100);
    } catch (err: unknown) {
      setIsDeleteLoading(false);
      if (err instanceof AxiosError) {
        const responseError = err.response?.data.error;
        toast.custom(<ToastTUI type="error" message={responseError} />);
      }
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <FormHeader
          action={`Edit flag: ${props.title}`}
          directions={`Update ${props.title}. Note, the flag key, created at, and updated at can not be changed manually.`}
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
        <ButtonGroup groupType="update">
          <FormButton
            typeOfButton="delete"
            type="button"
            text="Delete"
            onClick={() => setOpenDeleteModal(true)}
          />
          <div className="flex gap-3">
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
          </div>
        </ButtonGroup>
      </form>
      <DeleteModal
        resource="flag"
        isLoading={isDeleteLoading}
        setOpen={setOpenDeleteModal}
        open={openDeleteModal}
        onDelete={handleDelete}
      />
    </>
  );
}

export default UpdateFlagForm;
