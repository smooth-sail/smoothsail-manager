import { useState } from "react";
import { Flag } from "../types";
import Toggle from "./ui/Toggle";
import { useFlagToggleMutation } from "../hooks/flags";
import { formatDateTime } from "../utils/format";
import UpdateFlagModal from "./UpdateFlagModal";
import FlagsSegmentsModal from "./FlagsSegmentsModal";

type FlagItemProps = Flag;

function FlagItem(props: FlagItemProps) {
  const [isActive, setIsActive] = useState(props.isActive);
  const [openSegmentsModal, setOpenSegmentsModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { mutateAsync } = useFlagToggleMutation();

  const handleIsActive = (checked: boolean) => {
    setIsActive(checked);
    mutateAsync({ isActive: checked, fKey: props.fKey });
  };

  formatDateTime("10/30/2023, 18:16:48");

  return (
    <>
      <tr>
        <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
          {props.title}
          <dl className="font-normal lg:hidden">
            <dt className="sr-only">Flag Key</dt>
            <dd className="mt-1 truncate text-gray-700">{props.fKey}</dd>
            <dt className="sr-only sm:hidden">Updated At</dt>
            <dd className="mt-1 truncate text-gray-500 sm:hidden">
              {props.updatedAt}
            </dd>
          </dl>
        </td>
        <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
          {props.fKey}
        </td>
        <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
          {formatDateTime(props.updatedAt)}
        </td>
        <td className="px-3 py-4 text-sm font-medium">
          <span
            onClick={() => setOpenSegmentsModal(true)}
            className="cursor-pointer hover:text-ss-blgr"
          >
            Segments<span className="sr-only">, {props.title}</span>
          </span>
        </td>
        <td className="px-3 py-4 text-sm text-gray-500">
          <Toggle is_active={isActive} onIsActive={handleIsActive} />
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
      <UpdateFlagModal {...props} open={openEdit} setOpen={setOpenEdit} />
      <FlagsSegmentsModal
        title={props.title}
        fKey={props.fKey}
        open={openSegmentsModal}
        setOpen={setOpenSegmentsModal}
      />
    </>
  );
}

export default FlagItem;
