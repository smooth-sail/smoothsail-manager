import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import { useCreateAttributeMutation } from "@/hooks/attributes";
import { attributeTypes } from "@/utils/data";
import { newAttributeSchema } from "@/models/attributes";
import { Attribute } from "@/types";

import FormButton from "@/components/ui/FormButton";
import FormInput from "@/components/ui/FormInput";
import FormHeader from "@/components/ui/FormHeader";
import ButtonGroup from "@/components/ui/ButtonGroup";
import ToastTUI from "@/components/ToastTUI";

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

  const { mutateAsync: createAttribute } = useCreateAttributeMutation();

  const onSubmit = handleSubmit(async (newAttribute) => {
    try {
      await createAttribute(newAttribute);
      toast.custom(
        <ToastTUI
          type="success"
          message={`Attribute with key ${newAttribute.aKey} saved to database.`}
        />,
      );
      setOpen(false);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const responseError = err.response?.data.error;
        toast.custom(<ToastTUI type="error" message={responseError} />);
      }
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <FormHeader
        directions="Create your attribute. Note, the attribute key and data type cannot be changed after creation."
        action="Create an attribute"
      />
      <div className="mt-4 flex flex-col sm:flex-row gap-3 mb-6">
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
          text="Save"
        />
      </ButtonGroup>
    </form>
  );
}

export default CreateAttributeForm;
