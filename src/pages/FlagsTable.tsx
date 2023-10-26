import { useState } from "react";
import FlagItem from "../components/FlagItem";
import Button from "../components/ui/Button";
import { useFlags } from "../hooks/flags";
import CreateFlagModal from "../components/CreateFlagModal";

export default function FlagsTable() {
  const [openCreateFlagModal, setOpenCreateFlagModal] = useState(false);
  const { data: flags, isLoading } = useFlags();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Feature Flags
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all feature flags created. Click edit to view full
              details and add any segments you've created.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Button
              size="xl"
              text="Create New Flag"
              onClick={() => setOpenCreateFlagModal(true)}
            />
          </div>
        </div>
        <div className="-mx-4 mt-8 sm:-mx-0">
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
                  Flag Key
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Updated At
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  <span className="sr-only">Segments</span>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Toggle
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {flags?.map((flag) => <FlagItem key={flag.f_key} {...flag} />)}
            </tbody>
          </table>
        </div>
      </div>
      <CreateFlagModal
        open={openCreateFlagModal}
        setOpen={setOpenCreateFlagModal}
      />
    </>
  );
}
