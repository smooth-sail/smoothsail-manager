import { useState } from "react";
import { Rule } from "@/types";
import { useAttributes } from "@/hooks/attributes";
import FormButton from "../ui/FormButton";
import Modal from "../Modal";
import UpdateRuleForm from "../rules/UpdateRuleForm";
import CreateRuleForm from "../rules/CreateRuleForm";
import FormHeader from "../ui/FormHeader";
import { useNavigate } from "react-router-dom";
import EmptyState from "../EmptyState";

type SegmentsRulesProps = {
  rules: Rule[];
  sKey: string;
  title: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function SegmentsRules({ rules, sKey, setOpen, title }: SegmentsRulesProps) {
  const navigate = useNavigate();
  const [openCreateRuleModal, setOpenCreateRuleModal] = useState(false);
  const [openUpdateRuleModal, setOpenUpdateRuleModal] = useState(false);
  const [currAKey, setCurrAKey] = useState("");
  const [currRKey, setCurrRKey] = useState("");
  const [currOperator, setCurrOperator] = useState("");
  const [currValue, setCurrValue] = useState("");

  const { data: attributes } = useAttributes();

  return (
    <>
      {rules.length === 0 ? (
        <EmptyState
          buttonText="Create New Rule"
          subMessage="Click below to create a new rule."
          message="It doesn't look like you have any rules for this segment yet."
          handleClick={() => setOpenCreateRuleModal(true)}
        />
      ) : (
        <>
          <FormHeader
            action={`Edit rules for ${title}`}
            directions={`Click edit to modify a rule or create a new rule.`}
          />
          <div>
            <ul role="list" className="divide-y divide-gray-100">
              {rules.map(({ aKey, rKey, value, operator }) => (
                <li
                  key={rKey}
                  className="flex items-center justify-between gap-x-6 py-5"
                >
                  <div className="flex min-w-0 gap-x-4">
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {attributes?.find((a) => a.aKey === aKey)!.name}{" "}
                        {operator} {value}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCurrAKey(aKey);
                      setCurrRKey(rKey);
                      setCurrOperator(operator);
                      setCurrValue(value);
                      setOpenUpdateRuleModal(true);
                    }}
                    className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-ss-blgr"
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end gap-4">
            <FormButton
              className="w-28"
              typeOfButton="cancel"
              type="button"
              text="Close"
              onClick={() => setOpen(false)}
            />
            <FormButton
              className="w-28"
              typeOfButton="confirm"
              type="button"
              text="New Rule"
              onClick={() => setOpenCreateRuleModal(true)}
            />
          </div>
        </>
      )}
      <Modal open={openCreateRuleModal} setOpen={setOpenCreateRuleModal}>
        {attributes && attributes.length > 0 ? (
          <CreateRuleForm
            attributes={attributes}
            setOpen={setOpenCreateRuleModal}
            sKey={sKey}
          />
        ) : (
          <EmptyState
            buttonText="Attributes"
            subMessage="Go to the attributes page to get started."
            message="It doesn't look like you have any attributes yet."
            handleClick={() => navigate("/attributes")}
          />
        )}
      </Modal>
      <Modal open={openUpdateRuleModal} setOpen={setOpenUpdateRuleModal}>
        {attributes && (
          <UpdateRuleForm
            attributes={attributes}
            setOpen={setOpenUpdateRuleModal}
            aKey={currAKey}
            rKey={currRKey}
            operator={currOperator}
            value={currValue}
            sKey={sKey}
          />
        )}
      </Modal>
    </>
  );
}

export default SegmentsRules;
