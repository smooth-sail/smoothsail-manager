import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import UpdateRuleForm from "./UpdateRuleForm";
import DeleteModal from "./DeleteModal";
import { useDeleteSegmentRule } from "../hooks/segments";

type UpdateRuleModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sKey: string;
  rKey: string;
  aKey: string;
  value: string;
  operator: string;
};

function UpdateRuleModal({
  open,
  setOpen,
  sKey,
  aKey,
  rKey,
  value,
  operator,
}: UpdateRuleModalProps) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { mutateAsync: deleteRuleMutate } = useDeleteSegmentRule();
  const handleDeleteRule = () => {
    deleteRuleMutate({ rKey, sKey });
    setOpenDeleteModal(false);
    setOpen(false);
  };

  return (
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
              <Dialog.Panel className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all">
                <div className="mb-4">
                  <div className="mt-3 sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="flex justify-between text-base font-semibold leading-6 text-gray-900"
                    >
                      <span className="self-end">Edit a Rule</span>
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
                        Update your rule. If you don't have any attributes
                        defined go add some in the attributes tab.
                      </p>
                    </div>
                  </div>
                </div>
                <UpdateRuleForm
                  setOpen={setOpen}
                  sKey={sKey}
                  aKey={aKey}
                  rKey={rKey}
                  value={value}
                  operator={operator}
                />
                <DeleteModal
                  setOpen={setOpenDeleteModal}
                  open={openDeleteModal}
                  onDelete={handleDeleteRule}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default UpdateRuleModal;
