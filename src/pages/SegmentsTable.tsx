import { useState } from "react";
import Button from "../components/ui/Button";
import { useSegments } from "../hooks/segments";
import SegmentItem from "../components/SegmentItem";
import CreateSegmentModal from "../components/CreateSegmentModal";

export default function SegmentsTable() {
  const [open, setOpen] = useState(false);
  const { data: segments, isLoading } = useSegments();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Segments
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all segments created. Click edit to modify segment
              details or click a rule to modify that rule.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Button
              size="xl"
              text="Create New Segment"
              onClick={() => setOpen(true)}
            />
          </div>
        </div>
        <div className="-mx-4 mt-8 sm:-mx-0">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Segment Key
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Rules Operator
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  <span className="sr-only">Rules</span>
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {segments?.map((segment) => (
                <SegmentItem key={segment.sKey} {...segment} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CreateSegmentModal open={open} setOpen={setOpen} />
    </>
  );
}
