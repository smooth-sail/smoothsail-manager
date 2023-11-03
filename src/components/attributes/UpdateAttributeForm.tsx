import { useForm } from "react-hook-form";
import FormButton from "@/components/ui/FormButton";
import { Attribute } from "@/types";
import {
  useDeleteAttributeMutation,
  useUpdateAttributeMutation,
} from "@/hooks/attributes";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import ToastTUI from "../ToastTUI";
import { zodResolver } from "@hookform/resolvers/zod";
import { attributeUpdateSchema } from "@/models/attributes";
import FormInput from "../ui/FormInput";
import FormHeader from "../ui/FormHeader";

type UpdateAttributeFormProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & Attribute;

function UpdateAttributeForm({
  setOpen,
  aKey,
  type,
  name,
}: UpdateAttributeFormProps) {
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
    <>
      <FormHeader
        resource="attribute"
        onDelete={handleDelete}
        isDelete={true}
        directions={`Define your rule. If you don't have any attributes defined go add some in the attributes tab.`}
        action={`Edit attribute: ${name}`}
      />
      <form onSubmit={onSubmit}>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
        <div className="flex gap-4">
          <FormButton
            typeOfButton="cancel"
            type="button"
            text="Cancel"
            onClick={() => setOpen(false)}
          />
          <FormButton typeOfButton="confirm" type="submit" text="Save" />
        </div>
      </form>
    </>
  );
}

export default UpdateAttributeForm;
