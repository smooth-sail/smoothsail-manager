import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RadioGroup } from "@headlessui/react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import { newSegmentSchema } from "@/models/segments";
import {
  useDeleteSegmentMutation,
  useUpdateSegmentMutation,
} from "@/hooks/segments";
import { classNames } from "@/utils/helpers";
import { segmentRulesOperators } from "@/utils/data";
import { NewSegment, Segment, SegmentOperator } from "@/types";

import ToastTUI from "@/components/ToastTUI";
import DeleteModal from "@/components/DeleteModal";
import FormButton from "@/components/ui/FormButton";
import FormInput from "@/components/ui/FormInput";
import FormHeader from "@/components/ui/FormHeader";
import ButtonGroup from "@/components/ui/ButtonGroup";

function UpdateSegmentForm({
  setOpen,
  ...props
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & Segment) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selected, setSelected] = useState(() => {
    return segmentRulesOperators[
      segmentRulesOperators
        .map(({ name }) => name.toLowerCase())
        .indexOf(props.rulesOperator)
    ];
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<NewSegment>({
    resolver: zodResolver(newSegmentSchema),
    defaultValues: {
      title: props.title,
      description: props.description,
      sKey: props.sKey,
    },
  });

  const { mutateAsync: updateSegmentMutate } = useUpdateSegmentMutation();

  const onSubmit = handleSubmit(async (segmentUpdates) => {
    segmentUpdates.rulesOperator =
      selected.name.toLowerCase() as SegmentOperator;

    try {
      await updateSegmentMutate(segmentUpdates);
      toast.custom(
        <ToastTUI
          type="success"
          message={`Segment with key ${props.sKey} updated.`}
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

  const { mutateAsync: deleteSegment } = useDeleteSegmentMutation();
  const handleDelete = async () => {
    try {
      await deleteSegment(props.sKey);
      toast.custom(
        <ToastTUI
          type="success"
          message="Segment deleted from the database."
        />,
      );
      setOpen(false);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const responseError = err.response?.data.error;
        toast.custom(<ToastTUI type="error" message={responseError} />);
      }
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <FormHeader
          directions="Update your segment. Note, the segment key cannot be changed."
          action={`Edit segment: ${props.title}`}
        />
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
            <p className="block text-sm font-medium leading-6 text-gray-900">
              Segment Key
            </p>
            <div className="mt-2">
              <span className="block w-full rounded-md border-0 p-1.5 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                {props.sKey}
              </span>
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
                    checked
                      ? "z-10 border-ss-blgr bg-sky-50"
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
        <ButtonGroup groupType="update">
          <FormButton
            typeOfButton="delete"
            type="button"
            text="Delete"
            onClick={() => setOpenDeleteModal(true)}
          />
          <div className="flex gap-3">
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
          </div>
        </ButtonGroup>
      </form>
      <DeleteModal
        resource="segment"
        setOpen={setOpenDeleteModal}
        open={openDeleteModal}
        onDelete={handleDelete}
      />
    </>
  );
}

export default UpdateSegmentForm;
