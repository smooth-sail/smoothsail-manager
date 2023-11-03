import { classNames } from "@/utils/classNames";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import DeleteModal from "@/components/DeleteModal";

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
        <DeleteModal
          resource={resource}
          setOpen={setOpenDeleteModal}
          open={openDeleteModal}
          onDelete={onDelete}
        />
      )}
    </>
  );
}

export default FormHeader;
