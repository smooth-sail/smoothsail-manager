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
        className={`${classNames} rounded bg-[#239cba] px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-[#28B1D4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#239cba]`}
      >
        {text}
      </button>
    ),
    s: (
      <button
        onClick={onClick}
        type="button"
        className={`${classNames} rounded bg-[#239cba] px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-[#28B1D4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#239cba]`}
      >
        {text}
      </button>
    ),
    m: (
      <button
        onClick={onClick}
        type="button"
        className={`${classNames} rounded-md bg-[#239cba] px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-[#28B1D4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#239cba]`}
      >
        {text}
      </button>
    ),
    l: (
      <button
        onClick={onClick}
        type="button"
        className={`${classNames} rounded-md bg-[#239cba] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#28B1D4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#239cba]`}
      >
        {text}
      </button>
    ),
    xl: (
      <button
        onClick={onClick}
        type="button"
        className={`${classNames} rounded-md bg-[#239cba] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#28B1D4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#239cba]`}
      >
        {text}
      </button>
    ),
  };

  return buttons[size];
}

export default Button;
