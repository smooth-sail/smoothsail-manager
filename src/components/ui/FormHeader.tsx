import { Dialog } from "@headlessui/react";

type FormHeaderProps = {
  action: string;
  directions: string;
};

function FormHeader({ action, directions }: FormHeaderProps) {
  return (
    <div className="mb-2">
      <Dialog.Title
        as="h3"
        className="text-base font-semibold leading-6 text-gray-900"
      >
        {action}
      </Dialog.Title>
      <div className="mt-2">
        <p className="text-sm text-gray-500">{directions}</p>
      </div>
    </div>
  );
}

export default FormHeader;
