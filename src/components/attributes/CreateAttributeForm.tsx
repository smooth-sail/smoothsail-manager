import { useCreateAttributeMutation } from "@/hooks/attributes";
import { useForm } from "react-hook-form";
import FormButton from "@/components/ui/FormButton";
import { Attribute } from "@/types";
import { attributeTypes } from "@/utils/data";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import ToastTUI from "../ToastTUI";
import { zodResolver } from "@hookform/resolvers/zod";
import { newAttributeSchema } from "@/models/attributes";
import FormInput from "../ui/FormInput";
import FormHeader from "../ui/FormHeader";

type CreateAttributeFormProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function CreateAttributeForm({ setOpen }: CreateAttributeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Attribute>({
    resolver: zodResolver(newAttributeSchema),
  });

  const { mutateAsync: createAttributeMutate } = useCreateAttributeMutation();

  const onSubmit = handleSubmit(async (newAttribute) => {
    try {
      await createAttributeMutate(newAttribute);
      toast.custom(
        <ToastTUI
          type="success"
          message={`Attribute with key ${newAttribute.aKey} saved to database.`}
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
    <>
      <FormHeader
        directions="Define your rule. If you don't have any attributes defined go add some in the attributes tab."
        action="Create an attribute"
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
            <label
              htmlFor="aKey"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Attribute Key
            </label>
            <div className="mt-2">
              <FormInput
                id="aKey"
                placeholder="Enter an attribute key"
                register={register("aKey")}
                isError={!!errors.aKey}
                errorMessage={errors.aKey?.message}
              />
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
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-ss-blgr sm:text-sm sm:leading-6"
              {...register("type")}
            >
              {attributeTypes.map((aType) => (
                <option key={aType}>{aType}</option>
              ))}
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

export default CreateAttributeForm;
