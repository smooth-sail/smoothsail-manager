import { useNavigate } from "react-router-dom";

import { useFlagsSegments, useSegments } from "@/hooks/segments";

import FormHeader from "@/components/ui/FormHeader";
import FormButton from "@/components/ui/FormButton";
import EmptyState from "@/components/EmptyState";
import FlagsSegmentItem from "./FlagsSegmentItem";

export type FlagsSegmentsProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  fKey: string;
};

function FlagsSegments({ setOpen, title, fKey }: FlagsSegmentsProps) {
  const { data: flagsSegments } = useFlagsSegments(fKey);
  const { data: segments } = useSegments();
  const navigate = useNavigate();

  const isFlagsSegment = (title: string) =>
    !flagsSegments?.some((segment) => segment.title === title);

  return (
    <>
      <div className="mb-4">
        {segments?.length === 0 ? (
          <EmptyState
            buttonText="Segments"
            subMessage="Go to the segments page to get started."
            message="It doesn't look like you have any segments yet."
            handleClick={() => navigate("/segments")}
          />
        ) : (
          <>
            <FormHeader
              directions={`Click to associate a segment with ${title} or delete to delete that association. Close the modal when you're done. All updates will be sent automatically.`}
              action={`Segments for ${title}`}
            />
            <div>
              <ul role="list" className="divide-y divide-gray-100">
                {segments?.map(({ title, sKey }) => (
                  <FlagsSegmentItem
                    key={title}
                    isFlagsSegment={isFlagsSegment}
                    sKey={sKey}
                    title={title}
                    fKey={fKey}
                  />
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
      {segments?.length !== 0 && (
        <div className="flex justify-center">
          <FormButton
            className="w-24"
            typeOfButton="cancel"
            type="button"
            text="Close"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </>
  );
}

export default FlagsSegments;
