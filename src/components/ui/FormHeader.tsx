import { Fragment, useState } from "react";
import { createPortal } from "react-dom";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import { classNames } from "@/utils/helpers";
import { Dialog, Transition } from "@headlessui/react";

type FormHeaderProps = {
  action: string;
  directions: string;
  isDelete?: boolean;
  onDelete?: () => void;
  resource?: "flag" | "segment" | "attribute" | "rule";
};

function FormHeader({
  isDelete,
  action,
  directions,
  resource,
  onDelete,
}: FormHeaderProps) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  return (
    <>
      <div className="mb-4">
        <Dialog.Title
          as="h3"
          className={classNames(
            isDelete ? "flex justify-between" : "",
            "text-base font-semibold leading-6 text-gray-900",
          )}
        >
          <span className={classNames(isDelete ? "self-end" : "")}>
            {action}
          </span>
          {isDelete && (
            <button
              type="button"
              className="absolute right-2 top-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto focus:outline-none"
              onClick={() => {
                if (setOpenDeleteModal) {
                  setOpenDeleteModal(true);
                }
              }}
            >
              Delete
            </button>
          )}
        </Dialog.Title>
        <div className="mt-2">
          <p className="text-sm text-gray-500">{directions}</p>
        </div>
      </div>
      {isDelete && resource && (
        <FormHeader.DeleteModal
          resource={resource}
          setOpen={setOpenDeleteModal}
          open={openDeleteModal}
          onDelete={onDelete}
        />
      )}
    </>
  );
}

type DeleteModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete?: () => void;
  resource?: "flag" | "segment" | "attribute" | "rule";
  isForSDK?: boolean;
};

function DeleteModal({
  open,
  setOpen,
  onDelete,
  resource,
  isForSDK,
}: DeleteModalProps) {
  return createPortal(
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {isForSDK ? "Regenerate Key" : `Delete ${resource}`}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {isForSDK
                          ? "Are you sure you want to regenerate the SDK key? This will invalidate any existing key."
                          : `Are you sure you want to delete this ${resource}? All of the ${resource} data will be permanently removed from the database.`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={onDelete}
                  >
                    {isForSDK ? "Regenerate" : "Delete"}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>,
    document.getElementById("portal")!,
  );
}

FormHeader.DeleteModal = DeleteModal;

export default FormHeader;
