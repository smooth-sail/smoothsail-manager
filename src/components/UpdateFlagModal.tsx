import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Flag } from "../types";
import UpdateFlagForm from "./UpdateFlagForm";
import Button from "./ui/Button";
import DeleteModal from "./DeleteModal";
import { useDeleteFlagMutation } from "../hooks/flags";

type UpdateFlagModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & Flag;

function UpdateFlagModal({ open, setOpen, ...props }: UpdateFlagModalProps) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { mutateAsync: deleteFlagMutation } = useDeleteFlagMutation();
  const handleDeleteFlag = () => {
    deleteFlagMutation(props.fKey);
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
                            Edit flag: {props.title}
                          </span>
                          <Button
                            classNames="absolute right-6 top-6 bg-red-600 hover:bg-red-500"
                            size="l"
                            text="Delete"
                            onClick={() => setOpenDeleteModal(true)}
                          />
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Update {props.title}. Note, the flag key, created
                            at, and updated at can not be changed manually.
                          </p>
                        </div>
                      </div>
                    </div>
                    <UpdateFlagForm {...props} setOpen={setOpen} />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
            <DeleteModal
              open={openDeleteModal}
              setOpen={setOpenDeleteModal}
              onDelete={handleDeleteFlag}
            />
          </Dialog>
        </Transition.Root>
      </td>
    </tr>
  );
}

export default UpdateFlagModal;
