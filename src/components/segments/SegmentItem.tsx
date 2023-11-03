import { useState } from "react";
import { Segment } from "@/types";
import SegmentsRulesDropdown from "./SegmentsRulesDropdown";
import UpdateSegmentModal from "./UpdateSegmentModal";

type SegmentItemProps = Segment;

function SegmentItem(props: SegmentItemProps) {
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <>
      <tr>
        <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
          {props.title}
          <dl className="font-normal lg:hidden">
            <dt className="sr-only">Segment Key</dt>
            <dd className="mt-1 truncate text-gray-700">{props.sKey}</dd>
            <dt className="sr-only sm:hidden">Rules Operator</dt>
            <dd className="mt-1 truncate text-gray-500 sm:hidden">
              {props.rulesOperator}
            </dd>
          </dl>
        </td>
        <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
          {props.sKey}
        </td>
        <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
          {props.rulesOperator}
        </td>
        <td className="px-3 py-4 text-sm font-medium">
          <span
            // onClick={() => setOpenSegmentsModal(true)}
            className="cursor-pointer hover:text-ss-blgr"
          >
            Rules<span className="sr-only">, {props.title}</span>
          </span>
          {/* {<SegmentsRulesDropdown sKey={props.sKey} rules={props.rules} />} */}
        </td>
        <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <span
            onClick={() => setOpenEdit(true)}
            className="cursor-pointer hover:text-ss-blgr"
          >
            Edit<span className="sr-only">, {props.title}</span>
          </span>
        </td>
      </tr>
      <UpdateSegmentModal {...props} open={openEdit} setOpen={setOpenEdit} />
    </>
  );
}

export default SegmentItem;
