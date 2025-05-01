export interface IPropsBase {
  color?: string;
  className?: string;
}

export interface IPropsIconSquare extends IPropsBase {
  size?: number;
}

export interface IPropsIconRectangle extends IPropsBase {
  width?: number;
  height?: number;
}
