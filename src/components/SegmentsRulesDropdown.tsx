import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Rule } from "../types";
import CreateRuleModal from "./CreateRuleModal";
import UpdateRuleModal from "./UpdateRuleModal";
import { useAttributes } from "../hooks/attributes";

type SegmentsRulesDropdownProps = {
  rules: Rule[];
  s_key: string;
};

function SegmentsRulesDropdown({ rules, s_key }: SegmentsRulesDropdownProps) {
  const [openRuleModal, setOpenRuleModal] = useState(false);
  const [openUpdateRuleModal, setOpenUpdateRuleModal] = useState(false);
  const [currAKey, setCurrAKey] = useState("");
  const [currRKey, setCurrRKey] = useState("");
  const [currOperator, setCurrOperator] = useState("");
  const [currValue, setCurrValue] = useState("");

  const { data: attributes } = useAttributes();

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-ss-blgr">
            Rules
            <ChevronDownIcon
              className="-mr-1 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {rules?.map(({ r_key, a_key, operator, value }) => (
                <Menu.Item key={r_key}>
                  <div
                    onClick={() => {
                      setCurrAKey(a_key);
                      setCurrRKey(r_key);
                      setCurrOperator(operator);
                      setCurrValue(value);
                      setOpenUpdateRuleModal(true);
                    }}
                    className="cursor-pointer text-gray-700 px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    {attributes?.find((a) => a.a_key === a_key)!.name}
                  </div>
                </Menu.Item>
              ))}
              <Menu.Item>
                <button
                  onClick={() => setOpenRuleModal(true)}
                  className="w-full text-gray-700 px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Add rule
                </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <CreateRuleModal
        s_key={s_key}
        setOpen={setOpenRuleModal}
        open={openRuleModal}
      />
      <UpdateRuleModal
        a_key={currAKey}
        r_key={currRKey}
        operator={currOperator}
        value={currValue}
        s_key={s_key}
        setOpen={setOpenUpdateRuleModal}
        open={openUpdateRuleModal}
      />
    </>
  );
}

export default SegmentsRulesDropdown;
