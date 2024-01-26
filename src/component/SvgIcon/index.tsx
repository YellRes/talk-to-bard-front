import React from "react";
import classNames from "classnames";
import style from "./index.less";
// import ai from '@/assets/svg/ai.svg'

try {
  // 利用 webpack 提供的 require.context API 来创建自己的 context module 动态引入 icon
  // const importAll = (requireContext: __WebpackModuleApi.RequireContext) => {
  //     console.log(requireContext.keys(), 'svg')
  //     requireContext.keys().forEach(requireContext)
  // };
  // importAll(require.context('@/assets/svg', true, /\.svg$/));
  // debugger
  // ['./ai.svg'].forEach(require.context('@/assets/svg', true, /\.svg$/))
} catch (error) {
  console.error("importAll:", error);
}

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
