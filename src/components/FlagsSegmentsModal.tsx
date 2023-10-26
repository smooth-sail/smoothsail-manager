import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useFlagsSegments, useSegments } from "../hooks/segments";

type FlagsSegmentsModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  f_key: string;
};

export default function FlagsSegmentsModal({
  open,
  setOpen,
  title,
  f_key,
}: FlagsSegmentsModalProps) {
  const { data: flagsSegments } = useFlagsSegments(f_key);
  const { data: segments } = useSegments();
  return (
    <tr>
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
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Segments for {title}
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Click add to associate a segment with {title} or
                            delete to delete that association. Close the modal
                            when you're done. All updates will be sent
                            automatically.
                          </p>
                        </div>
                      </div>
                      <div>
                        <ul role="list" className="divide-y divide-gray-100">
                          {segments?.map(({ title }) => (
                            <li
                              key={title}
                              className="flex items-center justify-between gap-x-6 py-5"
                            >
                              <div className="flex min-w-0 gap-x-4">
                                <div className="min-w-0 flex-auto">
                                  <p className="text-sm font-semibold leading-6 text-gray-900">
                                    {title}
                                  </p>
                                </div>
                              </div>
                              <button className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                {flagsSegments?.some(
                                  (segment) => segment.title === title,
                                )
                                  ? "Delete"
                                  : "Add"}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="mt-3 w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </button>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </td>
    </tr>
  );
}
