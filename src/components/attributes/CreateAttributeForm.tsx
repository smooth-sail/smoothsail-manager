import { useCreateAttributeMutation } from "@/hooks/attributes";
import { useForm } from "react-hook-form";
import FormButton from "@/components/ui/FormButton";
import { Attribute } from "@/types";
import { attributeTypes } from "@/utils/attributeTypes";

type CreateAttributeFormProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function CreateAttributeForm({ setOpen }: CreateAttributeFormProps) {
  const { register, handleSubmit } = useForm<Attribute>();

  const { mutateAsync: createAttributeMutate } = useCreateAttributeMutation();

  const onSubmit = handleSubmit((newAttribute) => {
    createAttributeMutate(newAttribute);
    setOpen(false);
  });

  return (
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
            <input
              type="text"
              id="name"
              {...register("name")}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ss-blgr sm:text-sm sm:leading-6"
              placeholder="Enter an attribute name"
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
            <input
              type="text"
              id="aKey"
              {...register("aKey")}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ss-blgr sm:text-sm sm:leading-6"
              placeholder="Enter an attribute name"
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
  );
}

export default CreateAttributeForm;
