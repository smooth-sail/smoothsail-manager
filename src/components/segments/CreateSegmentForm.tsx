import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NewSegment, SegmentOperator } from "@/types";
import { newSegmentSchema } from "@/models/segments";
import { useCreateSegmentMutation } from "@/hooks/segments";
import { RadioGroup } from "@headlessui/react";
import { classNames } from "@/utils/classNames";
import FormButton from "@/components/ui/FormButton";
import { segmentRulesOperators } from "@/utils/data";
import ToastTUI from "../ToastTUI";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import FormInput from "../ui/FormInput";

function CreateSegmentForm({
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

  const onSubmit = handleSubmit(async (newSegment) => {
    newSegment.rulesOperator = selected.name.toLowerCase() as SegmentOperator;
    try {
      await mutateAsync(newSegment);
      toast.custom(
        <ToastTUI
          type="success"
          message={`Segment with key ${newSegment.sKey} saved to database.`}
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
            <FormInput
              id="title"
              placeholder="Enter a segment name"
              register={register("title")}
              isError={!!errors.title}
              errorMessage={errors.title?.message}
            />
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="sKey"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Segment Key
          </label>
          <div className="mt-2">
            <FormInput
              id="sKey"
              placeholder="Enter a segment key"
              register={register("sKey")}
              isError={!!errors.sKey}
              errorMessage={errors.sKey?.message}
            />
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
            id="description"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ss-blgr sm:text-sm sm:leading-6"
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
                  checked ? "z-10 border-ss-blgr bg-sky-50" : "border-gray-200",
                  "relative flex cursor-pointer border p-4 focus:outline-none",
                )
              }
            >
              {({ active, checked }) => (
                <>
                  <span
                    className={classNames(
                      checked
                        ? "bg-ss-blgr border-transparent"
                        : "bg-white border-gray-300",
                      active ? "ring-2 ring-offset-2 ring-ss-blgr" : "",
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
                        checked ? "text-ss-blgr" : "text-gray-900",
                        "block text-sm font-medium",
                      )}
                    >
                      {setting.name}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className={classNames(
                        checked ? "text-ss-blgr" : "text-gray-500",
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
        <FormButton typeOfButton="confirm" type="submit" text="Save" />
        <FormButton
          typeOfButton="cancel"
          type="button"
          text="Cancel"
          onClick={() => setOpen(false)}
        />
      </div>
    </form>
  );
}

export default CreateSegmentForm;
