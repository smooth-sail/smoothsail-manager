import { useAttributes } from "@/hooks/attributes";
import { useForm } from "react-hook-form";
import { useUpdateSegmentRule } from "@/hooks/segments";
import FormButton from "@/components/ui/FormButton";
import { operators } from "@/utils/data";
import toast from "react-hot-toast";
import ToastTUI from "../ToastTUI";
import { AxiosError } from "axios";

type UpdateRuleFormProps = {
  sKey: string;
  rKey: string;
  aKey: string;
  operator: string;
  value: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function UpdateRuleForm({
  aKey,
  rKey,
  sKey,
  operator,
  value,
  setOpen,
}: UpdateRuleFormProps) {
  const { data: attributes } = useAttributes();
  const { register, handleSubmit } = useForm<{
    attribute: string;
    operator: string;
    value: string;
    sKey: string;
  }>();

  const { mutateAsync: updateSegmentRuleMutate } = useUpdateSegmentRule();

  const onSubmit = handleSubmit(async ({ attribute, operator, value }) => {
    if (!attributes) return;
    const attr = attributes.find((a) => a.name === attribute)!.aKey;
    const data = {
      aKey: attr,
      operator,
      value,
      sKey,
      rKey,
    };

    try {
      await updateSegmentRuleMutate(data);
      toast.custom(
        <ToastTUI type="success" message="Rule successfully updated." />,
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
    <form onSubmit={onSubmit}>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div>
          <label
            htmlFor="attribute"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Attribute
          </label>
          <select
            id="attribute"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-ss-blgr sm:text-sm sm:leading-6"
            defaultValue={attributes?.find((a) => a.aKey === aKey)!.name}
            {...register("attribute")}
          >
            {attributes?.length === 0 ? (
              <option disabled>No attributes</option>
            ) : (
              attributes?.map(({ name }) => <option key={name}>{name}</option>)
            )}
          </select>
        </div>
        <div>
          <label
            htmlFor="operator"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Operator
          </label>
          <select
            id="operator"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-ss-blgr sm:text-sm sm:leading-6"
            defaultValue={operators.find((o) => o === operator)!}
            {...register("operator")}
          >
            {operators.map((operator) => (
              <option key={operator}>{operator}</option>
            ))}
          </select>
        </div>
        <div className="w-full">
          <label
            htmlFor="value"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Value
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="value"
              {...register("value")}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ss-blgr sm:text-sm sm:leading-6"
              defaultValue={value}
              placeholder="Enter a value"
            />
          </div>
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

export default UpdateRuleForm;
