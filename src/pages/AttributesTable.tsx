import { useState } from "react";
import Button from "@/components/ui/Button";
import { useAttributes } from "@/hooks/attributes";
import AttributeItem from "@/components/attributes/AttributeItem";
import Modal from "@/components/Modal";
import CreateAttributeForm from "@/components/attributes/CreateAttributeForm";
import EmptyState from "@/components/EmptyState";

function AttributesTable() {
  const [openCreateAttributeModal, setOpenCreateAttributeModal] =
    useState(false);
  const { data: attributes, isLoading } = useAttributes();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Attributes
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all attributes created. Click edit to update or delete
              an attribute.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Button
              size="xl"
              text="Create New Attribute"
              onClick={() => setOpenCreateAttributeModal(true)}
            />
          </div>
        </div>
        <div className="-mx-4 mt-8 sm:-mx-0">
          {attributes?.length === 0 ? (
            <div className="mt-36 flex justify-center items-center">
              <EmptyState
                handleClick={() => setOpenCreateAttributeModal(true)}
                isIcon={true}
                buttonText="Create New Attribute"
                message="It doesn't look like you have any attributes yet."
                subMessage="Get started by creating a new one."
              />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    Attribute Key
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    Type
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {attributes?.map((attribute) => (
                  <AttributeItem key={attribute.aKey} {...attribute} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Modal
        open={openCreateAttributeModal}
        setOpen={setOpenCreateAttributeModal}
      >
        <CreateAttributeForm setOpen={setOpenCreateAttributeModal} />
      </Modal>
    </>
  );
}

export default AttributesTable;
