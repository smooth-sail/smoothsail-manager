import { useForm } from "react-hook-form";
import FormButton from "./ui/FormButton";
import { Attribute } from "../types";
import { useUpdateAttributeMutation } from "../hooks/attributes";

type UpdateAttributeFormProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & Attribute;

function UpdateAttributeForm({
  setOpen,
  aKey,
  type,
  name,
}: UpdateAttributeFormProps) {
  const { register, handleSubmit } = useForm<Omit<Attribute, "type">>();

  const { mutateAsync: updateAttributeMutate } = useUpdateAttributeMutation();

  const onSubmit = handleSubmit((attributeUpdates) => {
    updateAttributeMutate(attributeUpdates);
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
              defaultValue={name}
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
              defaultValue={aKey}
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
  );
}

export default UpdateAttributeForm;
