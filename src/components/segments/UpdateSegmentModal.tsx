import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Segment } from "@/types";
import UpdateSegmentForm from "./UpdateSegmentForm";
import DeleteModal from "@/components/DeleteModal";
import { useDeleteSegmentMutation } from "@/hooks/segments";
import toast from "react-hot-toast";
import ToastTUI from "../ToastTUI";
import { AxiosError } from "axios";

type UpdateSegmentModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & Segment;

function UpdateSegmentModal({
  open,
  setOpen,
  ...props
}: UpdateSegmentModalProps) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { mutateAsync: deleteSegmentMutate } = useDeleteSegmentMutation();
  const handleDeleteSegment = async () => {
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
        toast.custom(<ToastTUI type="error" message={`${responseError}`} />);
      }
    }
    setOpenDeleteModal(false);
    setOpen(false);
  };

  return (
    <tr className="border-none">
      <td>
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                    <div className="mb-4">
                      <div className="mt-3 sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="flex justify-between text-base font-semibold leading-6 text-gray-900"
                        >
                          <span className="self-end">
                            Edit segment: {props.title}
                          </span>
                          <button
                            type="button"
                            className="absolute right-6 top-6 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto focus:outline-none"
                            onClick={() => setOpenDeleteModal(true)}
                          >
                            Delete
                          </button>
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Update {props.title}. Note, the flag key, created
                            at, and updated at can not be changed manually.
                          </p>
                        </div>
                      </div>
                    </div>
                    <UpdateSegmentForm {...props} setOpen={setOpen} />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
            <DeleteModal
              open={openDeleteModal}
              setOpen={setOpenDeleteModal}
              onDelete={handleDeleteSegment}
            />
          </Dialog>
        </Transition.Root>
      </td>
    </tr>
  );
}

export default UpdateSegmentModal;
