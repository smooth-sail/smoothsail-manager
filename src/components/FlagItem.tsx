import { useState } from "react";
import { Flag } from "../types";
import Toggle from "./ui/Toggle";
import { useFlagToggleMutation } from "../hooks/flags";

type FlagItemProps = Flag;

export default function FlagItem({
  is_active,
  created_at,
  id,
  f_key,
  title,
  updated_at,
}: FlagItemProps) {
  const [isActive, setIsActive] = useState(is_active);
  const { mutateAsync } = useFlagToggleMutation();

  const handleIsActive = (checked: boolean) => {
    console.log(checked);
    setIsActive(checked);
    // useMutation
    mutateAsync({ is_active: checked, flagKey: f_key, id });
  };
  return (
    <tr>
      <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
        {title}
        <dl className="font-normal lg:hidden">
          <dt className="sr-only">Flag Key</dt>
          <dd className="mt-1 truncate text-gray-700">{f_key}</dd>
          <dt className="sr-only sm:hidden">Updated At</dt>
          <dd className="mt-1 truncate text-gray-500 sm:hidden">
            {updated_at}
          </dd>
        </dl>
      </td>
      <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
        {f_key}
      </td>
      <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
        {updated_at}
      </td>
      <td className="px-3 py-4 text-sm text-gray-500">
        <Toggle is_active={isActive} onIsActive={handleIsActive} />
      </td>
      <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
        <a href="#" className="text-indigo-600 hover:text-indigo-900">
          Edit<span className="sr-only">, {title}</span>
        </a>
      </td>
    </tr>
  );
}
