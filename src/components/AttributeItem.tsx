import { useState } from "react";
import { Attribute } from "../types";
import UpdateAttributeModal from "./UpdateAttributeModal";

type AttributeItemProps = Attribute;

function AttributeItem(props: Attribute) {
  const [openEdit, setOpenEdit] = useState(false);
  return (
    <>
      <tr>
        <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
          {props.name}
          <dl className="font-normal lg:hidden">
            <dt className="sr-only">Attribute Key</dt>
            <dd className="mt-1 truncate text-gray-700">{props.aKey}</dd>
            <dt className="sr-only sm:hidden">Type</dt>
            <dd className="mt-1 truncate text-gray-500 sm:hidden">
              {props.type}
            </dd>
          </dl>
        </td>
        <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
          {props.aKey}
        </td>
        <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
          {props.type}
        </td>
        <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <span
            onClick={() => setOpenEdit(true)}
            className="cursor-pointer hover:text-ss-blgr"
          >
            Edit<span className="sr-only">, {props.name}</span>
          </span>
        </td>
      </tr>
      <UpdateAttributeModal setOpen={setOpenEdit} open={openEdit} {...props} />
    </>
  );
}

export default AttributeItem;
