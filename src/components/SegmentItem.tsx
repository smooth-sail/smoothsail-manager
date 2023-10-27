import { useState } from "react";
import { Segment } from "../types";
import SegmentsRulesDropdown from "./SegmentsRulesDropdown";
import UpdateSegmentModal from "./UpdateSegmentModal";

type SegmentItemProps = Segment;

export default function SegmentItem(props: SegmentItemProps) {
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <>
      <tr>
        <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
          {props.title}
          <dl className="font-normal lg:hidden">
            <dt className="sr-only">Segment Key</dt>
            <dd className="mt-1 truncate text-gray-700">{props.s_key}</dd>
            <dt className="sr-only sm:hidden">Rules Operator</dt>
            <dd className="mt-1 truncate text-gray-500 sm:hidden">
              {props.rules_operator}
            </dd>
          </dl>
        </td>
        <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
          {props.s_key}
        </td>
        <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
          {props.rules_operator}
        </td>
        <td className="px-3 py-4 text-sm text-gray-500">
          {<SegmentsRulesDropdown rules={props.rules} />}
        </td>
        <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <span
            onClick={() => setOpenEdit(true)}
            className="text-indigo-600 cursor-pointer hover:text-indigo-900"
          >
            Edit<span className="sr-only">, {props.title}</span>
          </span>
        </td>
      </tr>
      <UpdateSegmentModal {...props} open={openEdit} setOpen={setOpenEdit} />
    </>
  );
}
