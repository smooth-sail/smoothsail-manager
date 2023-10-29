import { useAttributes } from "../hooks/attributes";
import { useForm } from "react-hook-form";
import { useAddSegmentRule } from "../hooks/segments";

const operators = [
  "is",
  "is not",
  "contains",
  "does not contain",
  "exists",
  "does not exist",
  "=",
  "!=",
  ">=",
  "<=",
];

type RuleFormProps = {
  s_key: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function CreateRuleForm({ s_key, setOpen }: RuleFormProps) {
  const { data: attributes } = useAttributes();
  const { register, handleSubmit } = useForm<{
    attribute: string;
    operator: string;
    value: string;
    s_key: string;
  }>();

  const { mutateAsync: addSegmentRuleMutate } = useAddSegmentRule();

  const onSubmit = handleSubmit(({ attribute, operator, value }) => {
    if (!attributes) return;
    const attr = attributes.find((a) => a.name === attribute)!;
    addSegmentRuleMutate({
      a_key: attr.a_key,
      operator,
      value,
      s_key,
    });
    setOpen(false);
  });

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label
          htmlFor="attribute"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Attribute
        </label>
        <select
          id="attribute"
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          defaultValue="No attributes"
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
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Enter a value"
          />
        </div>
      </div>
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
        >
          Save
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default CreateRuleForm;
