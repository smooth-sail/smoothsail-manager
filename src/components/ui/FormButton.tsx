import { FC } from "react";

interface FormButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  typeOfButton: "delete" | "cancel" | "confirm";
  type: "submit" | "button";
  text: string;
}
const FormButton: FC<FormButtonProps> = ({
  typeOfButton,
  className,
  text,
  type,
  ...props
}) => {
  const confirmStyles =
    "inline-flex justify-center rounded-md bg-ss-blgr px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-ss-blgr-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ss-blgr sm:col-start-2";
  const cancelStyles =
    "inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0 focus-visible:outline-ss-blgr";
  const deleteStyles =
    "rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none";

  const styles = {
    delete: deleteStyles,
    confirm: confirmStyles,
    cancel: cancelStyles,
  };

  return (
    <button
      {...props}
      type={type}
      className={`${className} ${styles[typeOfButton]}`}
    >
      {text}
    </button>
  );
};

export default FormButton;
