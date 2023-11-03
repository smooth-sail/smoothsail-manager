import { useState } from "react";
import { Segment } from "@/types";
import SegmentsRules from "./SegmentsRules";
import Modal from "../Modal";
import FormHeader from "../FormHeader";
import { useDeleteSegmentMutation } from "@/hooks/segments";
import toast from "react-hot-toast";
import ToastTUI from "../ToastTUI";
import { AxiosError } from "axios";
import UpdateSegmentForm from "./UpdateSegmentForm";

type SegmentItemProps = Segment;

function SegmentItem(props: SegmentItemProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openRulesModal, setOpenRulesModal] = useState(false);
  const { mutateAsync: deleteSegmentMutate } = useDeleteSegmentMutation();
  const handleDelete = async () => {
    try {
      await deleteSegmentMutate(props.sKey);
      toast.custom(
        <ToastTUI
          type="success"
          message="Segment deleted from the database."
        />,
      );
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const responseError = err.response?.data.error;
        toast.custom(<ToastTUI type="error" message={responseError} />);
      }
    }
    setOpenEdit(false);
  };

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
            onClick={() => setOpenRulesModal(true)}
            className="cursor-pointer hover:text-ss-blgr"
          >
            Rules<span className="sr-only">, {props.title}</span>
          </span>
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
        <FormHeader
          resource="segment"
          onDelete={handleDelete}
          isDelete={true}
          directions={`Update ${props.title}.`}
          action={`Edit segment: ${props.title}`}
        />
        <UpdateSegmentForm {...props} setOpen={setOpenEdit} />
      </Modal>
      <Modal open={openRulesModal} setOpen={setOpenRulesModal}>
        <FormHeader
          action={`Edit rules for ${props.title}`}
          directions={`Click edit to modify a rule or create a new rule.`}
        />
        <SegmentsRules
          setOpen={setOpenRulesModal}
          sKey={props.sKey}
          rules={props.rules}
        />
      </Modal>
    </>
  );
}

export default SegmentItem;
