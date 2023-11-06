import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegisterReturn<string>;
  isError: boolean;
  errorMessage: string | undefined;
}

const errorStyles =
  "block w-full rounded-md border-0 py-1.5 pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6";

const FormInput: React.FC<FormInputProps> = ({
  register,
  isError,
  errorMessage,
  className,
  ...props
}) => {
  return (
    <>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          {...register}
          {...props}
          type="text"
          className={
            isError
              ? errorStyles
              : `${className} block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-ss-blgr sm:text-sm sm:leading-6`
          }
        />
        {isError && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {isError && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
    </>
  );
};

export default FormInput;
