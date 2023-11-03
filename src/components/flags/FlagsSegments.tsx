import {
  useFlagsSegments,
  useSegments,
  useUpdateFlagsSegmentMutation,
} from "@/hooks/segments";
import toast from "react-hot-toast";
import ToastTUI from "../ToastTUI";
import { AxiosError } from "axios";
import FormHeader from "@/components/ui/FormHeader";
import FormButton from "../ui/FormButton";

export type FlagsSegmentsProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  fKey: string;
};

function FlagsSegments({ setOpen, title, fKey }: FlagsSegmentsProps) {
  const { data: flagsSegments } = useFlagsSegments(fKey);
  const { data: segments } = useSegments();
  const { mutateAsync: updateFlagsSegmentMutate } =
    useUpdateFlagsSegmentMutation(fKey);

  const handleUpdateFlagSegment = async (sKey: string, action: string) => {
    try {
      await updateFlagsSegmentMutate({
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

  const isFlagsSegment = (title: string) =>
    !flagsSegments?.some((segment) => segment.title === title);

  return (
    <>
      <div className="mb-4">
        <FormHeader
          directions={`Click to associate a segment with ${title} or delete to delete that association. Close the modal when you're done. All updates will be sent automatically.`}
          action={`Segments for ${title}`}
        />
        <div>
          <ul role="list" className="divide-y divide-gray-100">
            {segments?.map(({ title, sKey }) => (
              <li
                key={title}
                className="flex items-center justify-between gap-x-6 py-5"
              >
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
                    handleUpdateFlagSegment(sKey, action);
                  }}
                  className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-ss-blgr"
                >
                  {isFlagsSegment(title) ? "Add" : "Delete"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-center">
        <FormButton
          className="w-36"
          typeOfButton="cancel"
          type="button"
          text="Close"
          onClick={() => setOpen(false)}
        />
      </div>
    </>
  );
}

export default FlagsSegments;
