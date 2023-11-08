type ButtonProps = {
  size: "xs" | "s" | "m" | "l" | "xl";
  text: string;
  classNames?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

function Button({ size, text, onClick, classNames }: ButtonProps) {
  const buttons = {
    xs: (
      <button
        onClick={onClick}
        type="button"
        className={`${classNames} rounded bg-ss-blgr px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-ss-blgr-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ss-blgr`}
      >
        {text}
      </button>
    ),
    s: (
      <button
        onClick={onClick}
        type="button"
        className={`${classNames} rounded bg-ss-blgr px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-ss-blgr-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ss-blgr`}
      >
        {text}
      </button>
    ),
    m: (
      <button
        onClick={onClick}
        type="button"
        className={`${classNames} rounded-md bg-ss-blgr px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-ss-blgr-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ss-blgr`}
      >
        {text}
      </button>
    ),
    l: (
      <button
        onClick={onClick}
        type="button"
        className={`${classNames} rounded-md bg-ss-blgr px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-ss-blgr-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ss-blgr`}
      >
        {text}
      </button>
    ),
    xl: (
      <button
        onClick={onClick}
        type="button"
        className={`${classNames} rounded-md bg-ss-blgr px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-ss-blgr-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ss-blgr`}
      >
        {text}
      </button>
    ),
  };

  return buttons[size];
}

export default Button;
