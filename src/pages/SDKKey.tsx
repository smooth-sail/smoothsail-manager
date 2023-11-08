import { useState } from "react";
import toast from "react-hot-toast";
import { ClipboardDocumentIcon, KeyIcon } from "@heroicons/react/24/outline";
import { AxiosError } from "axios";

import { useGenerateKeyMutation, useKey } from "@/hooks/sdk";

import ToastTUI from "@/components/ToastTUI";
import DeleteModal from "@/components/DeleteModal";
import FormButton from "@/components/ui/FormButton";

function SDKKey() {
  const { error, isLoading, data: sdkKey } = useKey();
  const { mutateAsync: generateKey } = useGenerateKeyMutation();
  const [isCopied, setIsCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    if (!sdkKey) return;

    navigator.clipboard.writeText(sdkKey);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const handleRegenerateKey = async () => {
    try {
      await generateKey();
      toast.custom(
        <ToastTUI type="success" message="Key was successfully regenerated." />,
      );
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const responseError = err.response?.data.error;
        toast.custom(<ToastTUI type="error" message={responseError} />);
      }
    }

    setOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    if (error instanceof AxiosError) {
      const responseError = error.response?.data.error;
      toast.custom(<ToastTUI type="error" message={responseError} />);
    }
  }

  return (
    <div className="bg-white max-w-2xl shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          SDK Key
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          In your application, provide the SDK key to connect to the feature
          flag manager.
        </p>
        {sdkKey && (
          <div className="mt-5">
            <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:items-center">
                <KeyIcon
                  className="h-8 w-auto sm:h-6 sm:flex-shrink-0"
                  viewBox="0 0 36 24"
                  aria-hidden="true"
                />
                <div className="mt-3 sm:ml-4 sm:mt-0">
                  <div className="text-sm font-medium text-gray-900 break-words">
                    {sdkKey}
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:ml-6 sm:mt-0 sm:flex-shrink-0">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={handleCopy}
                >
                  {isCopied ? "Copied!" : "Copy"}
                  <ClipboardDocumentIcon className="w-5 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <FormButton
            className="w-fit mt-4"
            type="button"
            typeOfButton="confirm"
            text="Regenerate Key"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>
      <DeleteModal
        isForSDK={true}
        open={open}
        setOpen={setOpen}
        onDelete={handleRegenerateKey}
      />
    </div>
  );
}

export default SDKKey;
