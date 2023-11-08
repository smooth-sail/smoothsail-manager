import { ReactNode } from "react";

type ButtonGroupProps = {
  groupType: "create" | "update";
  children: ReactNode;
};

function ButtonGroup({ groupType, children }: ButtonGroupProps) {
  const styles =
    groupType === "create"
      ? "mt-3 flex gap-3 justify-end"
      : "mt-3 flex justify-between";

  return <div className={styles}>{children}</div>;
}

export default ButtonGroup;
