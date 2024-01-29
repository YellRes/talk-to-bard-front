import React from "react";
import classNames from "classnames";
import style from "./index.less";

type TCursor = "auto" | "pointer" | "wait" | "help" | "move";
export type IconProps = {
  name: string;
  onClick?: () => void;
  color?: string;
  className?: string;
  size?: number;
  cursor?: TCursor;
};

const SvgIcon: React.FC<IconProps> = (props) => {
  const { name, color, size = 20, onClick, className, cursor = "auto" } = props;
  return (
    <svg
      {...props}
      onClick={onClick}
      className={classNames(style.svgIcon, className)}
      style={{
        color,
        fontSize: size && `${size}px`,
        cursor: cursor,
        ...props.style,
      }}
      aria-hidden="true"
    >
      <use xlinkHref={"#" + name} />
    </svg>
  );
};

export default SvgIcon;
