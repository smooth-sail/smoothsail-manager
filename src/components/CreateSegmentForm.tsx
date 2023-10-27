import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { NewSegment, SegmentOperator } from "../types";
import { newSegmentSchema } from "../models/segments";
import { useCreateSegmentMutation } from "../hooks/segments";
import { RadioGroup } from "@headlessui/react";
import { classNames } from "../utils/classNames";

const segmentRulesOperators = [
  {
    name: "Any",
    description: "Return true if any of the rules return true",
  },
  {
    name: "All",
    description: "Return true if all of the rules return true",
  },
];

export default function CreateSegmentForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [selected, setSelected] = useState(segmentRulesOperators[0]);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<NewSegment>({
    resolver: zodResolver(newSegmentSchema),
  });

  const { mutateAsync } = useCreateSegmentMutation();

  const onSubmit = handleSubmit((newSegment) => {
    newSegment.rules_operator = selected.name.toLowerCase() as SegmentOperator;
    mutateAsync(newSegment);
    setOpen(false);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="flex-col flex sm:flex-row gap-3">
        <div className="w-full">
          <label
            htmlFor="title"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Segment Name
          </label>
          <div className="mt-2">
            <input
              {...register("title")}
              type="text"
              name="title"
              id="title"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter a segment name"
            />
            {errors.title?.message && (
              <p>{errors.title?.message as ReactNode}</p>
            )}
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="s_key"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Segment Key
          </label>
          <div className="mt-2">
            <input
              {...register("s_key")}
              type="text"
              name="s_key"
              id="s_key"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter a segment key"
            />
            {errors.s_key?.message && (
              <p>{errors.s_key?.message as ReactNode}</p>
            )}
          </div>
        </div>
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Description
        </label>
        <div className="mt-2">
          <textarea
            {...register("description")}
            rows={4}
            name="description"
            id="description"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Write an optional description about your segment"
          />
        </div>
      </div>
      <RadioGroup value={selected} onChange={setSelected}>
        <RadioGroup.Label className="block text-sm font-medium leading-6 text-gray-900">
          Rules Operator
        </RadioGroup.Label>
        <div className="-space-y-px rounded-md bg-white mt-2">
          {segmentRulesOperators.map((setting, settingIdx) => (
            <RadioGroup.Option
              key={setting.name}
              value={setting}
              className={({ checked }) =>
                classNames(
                  !settingIdx ? "rounded-tl-md rounded-tr-md" : "",
                  settingIdx === segmentRulesOperators.length - 1
                    ? "rounded-bl-md rounded-br-md"
                    : "",
                  checked
                    ? "z-10 border-indigo-200 bg-indigo-50"
                    : "border-gray-200",
                  "relative flex cursor-pointer border p-4 focus:outline-none",
                )
              }
            >
              {({ active, checked }) => (
                <>
                  <span
                    className={classNames(
                      checked
                        ? "bg-indigo-600 border-transparent"
                        : "bg-white border-gray-300",
                      active ? "ring-2 ring-offset-2 ring-indigo-600" : "",
                      "mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center",
                    )}
                    aria-hidden="true"
                  >
                    <span className="rounded-full bg-white w-1.5 h-1.5" />
                  </span>
                  <span className="ml-3 flex flex-col">
                    <RadioGroup.Label
                      as="span"
                      className={classNames(
                        checked ? "text-indigo-900" : "text-gray-900",
                        "block text-sm font-medium",
                      )}
                    >
                      {setting.name}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className={classNames(
                        checked ? "text-indigo-700" : "text-gray-500",
                        "block text-sm",
                      )}
                    >
                      {setting.description}
                    </RadioGroup.Description>
                  </span>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
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
