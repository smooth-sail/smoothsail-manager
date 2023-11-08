import { useState } from "react";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useDeleteAttributeMutation,
  useUpdateAttributeMutation,
} from "@/hooks/attributes";
import { attributeUpdateSchema } from "@/models/attributes";
import { Attribute } from "@/types";

import ToastTUI from "@/components/ToastTUI";
import FormInput from "@/components/ui/FormInput";
import FormHeader from "@/components/ui/FormHeader";
import FormButton from "@/components/ui/FormButton";
import ButtonGroup from "@/components/ui/ButtonGroup";
import DeleteModal from "../DeleteModal";

type UpdateAttributeFormProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & Attribute;

function UpdateAttributeForm({
  setOpen,
  aKey,
  type,
  name,
}: UpdateAttributeFormProps) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<Attribute, "type">>({
    resolver: zodResolver(attributeUpdateSchema),
    defaultValues: {
      aKey,
      name,
    },
  });

  const { mutateAsync: updateAttributeMutate } = useUpdateAttributeMutation();

  const onSubmit = handleSubmit(async (attributeUpdates) => {
    try {
      await updateAttributeMutate(attributeUpdates);
      toast.custom(
        <ToastTUI
          type="success"
          message={`Attribute with key ${aKey} updated.`}
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

  const { mutateAsync: deleteAttributeMutate } = useDeleteAttributeMutation();
  const handleDelete = async () => {
    try {
      await deleteAttributeMutate(aKey);
      toast.custom(
        <ToastTUI
          type="success"
          message="Attribute deleted from the database."
        />,
      );
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const responseError = err.response?.data.error;
        toast.custom(<ToastTUI type="error" message={responseError} />);
      }
    }
    setOpen(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <FormHeader
        directions="Update your attribute. Note, you can only update the title. Attribute key and data type cannot be changed."
        action={`Edit attribute: ${name}`}
      />
      <div className="mt-2 flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Title
          </label>
          <div className="mt-2">
            <FormInput
              id="name"
              placeholder="Enter an attribute name"
              register={register("name")}
              isError={!!errors.name}
              errorMessage={errors.name?.message}
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="block text-sm font-medium leading-6 text-gray-900">
            Attribute Key
          </div>
          <div className="mt-2">
            <span className="block w-full rounded-md border-0 p-1.5 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
              {aKey}
            </span>
          </div>
        </div>
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Type
          </label>
          <select
            id="type"
            name="type"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-400 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-ss-blgr sm:text-sm sm:leading-6"
            disabled
            defaultValue={type}
          >
            <option>{type}</option>
          </select>
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
            text="Save"
          />
        </div>
      </ButtonGroup>
      <DeleteModal
        resource="attribute"
        setOpen={setOpenDeleteModal}
        open={openDeleteModal}
        onDelete={handleDelete}
      />
    </form>
  );
}

export default UpdateAttributeForm;
