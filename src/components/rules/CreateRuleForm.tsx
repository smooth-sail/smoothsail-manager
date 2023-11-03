import { useForm } from "react-hook-form";
import { useAddSegmentRule } from "@/hooks/segments";
import FormButton from "@/components/ui/FormButton";
import toast from "react-hot-toast";
import ToastTUI from "../ToastTUI";
import { AxiosError } from "axios";
import { Attribute } from "@/types";
import {
  booleanOperators,
  numberOperators,
  stringOperators,
} from "@/utils/data";
import FormInput from "../ui/FormInput";
import FormHeader from "../FormHeader";

type RuleFormProps = {
  sKey: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  attributes: Attribute[];
};

type RuleFormInputs = {
  attribute: string;
  operator: string;
  value: string;
  sKey: string;
};

function CreateRuleForm({ sKey, setOpen, attributes }: RuleFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<RuleFormInputs>({
    defaultValues: {
      attribute: attributes.length > 0 ? attributes[0].name : "No attributes",
      sKey,
    },
  });

  const { mutateAsync: addSegmentRuleMutate } = useAddSegmentRule();

  const currDataType = attributes.find(
    (a) => a.name === watch("attribute"),
  )!.type;

  const operators = (() => {
    switch (currDataType) {
      case "string":
        return stringOperators;
      case "number":
        return numberOperators;
      case "boolean":
        return booleanOperators;
    }
  })();

  const onSubmit = handleSubmit(async ({ attribute, operator, value }) => {
    const attr = attributes.find((a) => a.name === attribute)!;
    switch (attr.type) {
      case "boolean":
        if (value !== "true" && value !== "false") {
          setError("value", { message: "Must be true or false" });
          return;
        }
        break;
      case "number":
        if (!value || Number.isNaN(Number(value))) {
          setError("value", { message: "The value must be a number" });
          return;
        }
        break;
      case "string":
        if (!value) {
          setError("value", { message: "Value is required" });
          return;
        }
        break;
    }

    try {
      await addSegmentRuleMutate({
        aKey: attr.aKey,
        operator,
        value,
        sKey,
      });
      toast.custom(
        <ToastTUI
          type="success"
          message={`Rule added to segment key: ${sKey}.`}
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
        action="Create a Rule"
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
              {...register("attribute")}
            >
              {attributes.length === 0 ? (
                <option disabled>No attributes</option>
              ) : (
                attributes.map(({ name }) => <option key={name}>{name}</option>)
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
              {...register("operator")}
            >
              {operators.map((operator) => (
                <option key={operator}>{operator}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="value"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Value
            </label>
            <div className="mt-2">
              <FormInput
                id="value"
                placeholder="Enter a value"
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

export default CreateRuleForm;
