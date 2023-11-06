import { useForm } from "react-hook-form";
import { useDeleteSegmentRule, useUpdateSegmentRule } from "@/hooks/segments";
import FormButton from "@/components/ui/FormButton";
import toast from "react-hot-toast";
import ToastTUI from "../ToastTUI";
import { AxiosError } from "axios";
import FormHeader from "../ui/FormHeader";
import { RuleFormInputs } from "./CreateRuleForm";
import { Attribute } from "@/types";
import FormInput from "../ui/FormInput";
import { getValidOperators, isValidRuleValue } from "@/utils/helpers";

type UpdateRuleFormProps = {
  sKey: string;
  rKey: string;
  aKey: string;
  operator: string;
  value: string;
  attributes: Attribute[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function UpdateRuleForm({
  aKey,
  rKey,
  sKey,
  operator,
  value,
  setOpen,
  attributes,
}: UpdateRuleFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RuleFormInputs>({
    defaultValues: {
      attribute: attributes.find((a) => a.aKey === aKey)!.name,
      value,
      sKey,
    },
  });

  const { mutateAsync: updateSegmentRuleMutate } = useUpdateSegmentRule();

  const currDataType = attributes.find(
    (a) => a.name === watch("attribute"),
  )!.type;
  const operators = getValidOperators(currDataType);

  const isNoValueOperator = () =>
    watch("operator") === "exists" || watch("operator") === "does not exist";

  const onSubmit = handleSubmit(async ({ attribute, operator, value }) => {
    const { type, aKey } = attributes.find((a) => a.name === attribute)!;
    if (!isValidRuleValue(type, operator, value, setError)) return;

    if (isNoValueOperator()) {
      value = " ";
    }

    try {
      await updateSegmentRuleMutate({
        aKey,
        operator,
        value,
        sKey,
        rKey,
      });
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

  const { mutateAsync: deleteRuleMutate } = useDeleteSegmentRule();
  const handleDelete = async () => {
    try {
      await deleteRuleMutate({ rKey, sKey });
      toast.custom(
        <ToastTUI type="success" message="Rule deleted from database." />,
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
        resource="rule"
        onDelete={handleDelete}
        isDelete={true}
        directions={
          "Update your rule. If you don't have any attributes defined go add some in the attributes tab."
        }
        action="Edit a rule"
      />
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
              {...register("attribute", {
                onChange: () => {
                  setValue("operator", "=");
                },
              })}
            >
              {attributes.length === 0 ? (
                <option disabled>No attributes</option>
              ) : (
                attributes.map(({ name }) => <option key={name}>{name}</option>)
              )}
            </select>
          </div>
          <div className="flex-1">
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
              {...register("operator", {
                onChange: () => {
                  if (isNoValueOperator()) {
                    setValue("value", "");
                  }
                },
              })}
            >
              {operators.map((operator) => (
                <option key={operator}>{operator}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label
              htmlFor="value"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Value
            </label>
            <div className="mt-2">
              <FormInput
                disabled={isNoValueOperator()}
                className={
                  isNoValueOperator()
                    ? "text-gray-200 border-gray-200 bg-gray-100"
                    : ""
                }
                id="value"
                placeholder={isNoValueOperator() ? "" : "Enter a value"}
                register={register("value")}
                isError={!!errors.value}
                errorMessage={errors.value?.message}
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
    </>
  );
}

export default UpdateRuleForm;
