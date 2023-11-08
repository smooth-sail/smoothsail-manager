import toast from "react-hot-toast";
import ToastTUI from "../ToastTUI";
import { AxiosError } from "axios";

import { useUpdateFlagsSegmentMutation } from "@/hooks/segments";

type FlagsSegmentItemProps = {
  title: string;
  sKey: string;
  fKey: string;
  isFlagsSegment: (title: string) => boolean;
};

function FlagsSegmentItem({
  title,
  fKey,
  sKey,
  isFlagsSegment,
}: FlagsSegmentItemProps) {
  const { mutateAsync: updateFlagsSegment } =
    useUpdateFlagsSegmentMutation(fKey);
  const handleUpdate = async (sKey: string, action: string) => {
    try {
      await updateFlagsSegment({
        fKey,
        sKey,
        action,
      });
      toast.custom(
        <ToastTUI
          type="success"
          message={`Segment successfully ${
            action === "segment add" ? "added" : "removed"
          }.`}
        />,
      );
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const responseError = err.response?.data.error;
        toast.custom(<ToastTUI type="error" message={responseError} />);
      }
    }
  };

  return (
    <li key={title} className="flex items-center justify-between gap-x-6 py-5">
      <div className="flex min-w-0 gap-x-4">
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {title}
          </p>
        </div>
      </div>
      <button
        onClick={() => {
          const action = isFlagsSegment(title)
            ? "segment add"
            : "segment remove";
          handleUpdate(sKey, action);
        }}
        className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-ss-blgr"
      >
        {isFlagsSegment(title) ? "Add" : "Delete"}
      </button>
    </li>
  );
}

export default FlagsSegmentItem;
