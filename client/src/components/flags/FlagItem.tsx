import { useState } from "react";

import ToastTUI from "../ToastTUI";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import { useFlagToggleMutation } from "@/hooks/flags";
import { formatDateTime } from "@/utils/format";
import { Flag } from "@/types";

import Modal from "@/components/Modal";
import Toggle from "@/components/ui/Toggle";
import UpdateFlagForm from "./UpdateFlagForm";
import FlagsSegments from "./FlagsSegments";

function FlagItem(props: Flag) {
  const [isActive, setIsActive] = useState(props.isActive);
  const [openSegmentsModal, setOpenSegmentsModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { mutateAsync: toggleFlag } = useFlagToggleMutation();

  const handleIsActive = async (checked: boolean) => {
    try {
      setIsActive(checked);
      await toggleFlag({ isActive: checked, fKey: props.fKey });
      toast.custom(
        <ToastTUI
          type="success"
          message={`Flag with key ${props.fKey} toggled ${
            checked ? "on" : "off"
          }.`}
        />,
      );
    } catch (err: unknown) {
      setIsActive(!checked);
      if (err instanceof AxiosError) {
        const responseError = err.response?.data.error;
        toast.custom(<ToastTUI type="error" message={responseError} />);
      }
    }
  };

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
          <Toggle isActive={isActive} onIsActive={handleIsActive} />
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
      <Modal open={openEdit} setOpen={setOpenEdit}>
        <UpdateFlagForm {...props} setOpen={setOpenEdit} />
      </Modal>
      <Modal open={openSegmentsModal} setOpen={setOpenSegmentsModal}>
        <FlagsSegments
          setOpen={setOpenSegmentsModal}
          fKey={props.fKey}
          title={props.title}
        />
      </Modal>
    </>
  );
}

export default FlagItem;
