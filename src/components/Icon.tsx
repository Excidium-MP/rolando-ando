import React from 'react';
import Svg, { Circle, Path, Rect, type SvgProps } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
} & Omit<SvgProps, 'color'>;

const baseStrokeProps = (color: string, width = 1.6) => ({
  fill: 'none' as const,
  stroke: color,
  strokeWidth: width,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

function makeIcon(render: (color: string) => React.ReactNode) {
  return function IconComponent({ size = 22, color = '#1A1815', ...rest }: IconProps) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" {...rest}>
        {render(color)}
      </Svg>
    );
  };
}

export const Icon = {
  home: makeIcon((c) => (
    <Path {...baseStrokeProps(c)} d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-3v-7H8v7H5a2 2 0 01-2-2v-9z" />
  )),
  homeFill: makeIcon((c) => (
    <Path fill={c} d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-3v-7H8v7H5a2 2 0 01-2-2v-9z" />
  )),
  map: makeIcon((c) => (
    <Path {...baseStrokeProps(c)} d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" />
  )),
  mapFill: makeIcon((c) => (
    <>
      <Path fill={c} fillOpacity={0.3} d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z" />
      <Path {...baseStrokeProps(c)} d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" />
    </>
  )),
  plus: makeIcon((c) => <Path {...baseStrokeProps(c, 1.8)} d="M12 5v14M5 12h14" />),
  message: makeIcon((c) => (
    <Path {...baseStrokeProps(c)} d="M21 12a8 8 0 01-12 7l-5 1 1-5a8 8 0 1116-3z" />
  )),
  messageFill: makeIcon((c) => (
    <Path fill={c} d="M21 12a8 8 0 01-12 7l-5 1 1-5a8 8 0 1116-3z" />
  )),
  user: makeIcon((c) => (
    <>
      <Circle cx="12" cy="8" r="4" {...baseStrokeProps(c)} />
      <Path {...baseStrokeProps(c)} d="M4 21c0-4 4-7 8-7s8 3 8 7" />
    </>
  )),
  userFill: makeIcon((c) => (
    <>
      <Circle cx="12" cy="8" r="4" fill={c} />
      <Path fill={c} d="M4 21c0-4 4-7 8-7s8 3 8 7" />
    </>
  )),
  heart: makeIcon((c) => (
    <Path {...baseStrokeProps(c)} d="M12 21s-7-4.5-9-9a5 5 0 019-3 5 5 0 019 3c-2 4.5-9 9-9 9z" />
  )),
  heartFill: makeIcon((c) => (
    <Path fill={c} d="M12 21s-7-4.5-9-9a5 5 0 019-3 5 5 0 019 3c-2 4.5-9 9-9 9z" />
  )),
  comment: makeIcon((c) => (
    <Path {...baseStrokeProps(c)} d="M21 12a8 8 0 01-12 7l-5 1 1-5a8 8 0 1116-3z" />
  )),
  share: makeIcon((c) => (
    <Path {...baseStrokeProps(c)} d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4M12 2v14" />
  )),
  bookmark: makeIcon((c) => (
    <Path {...baseStrokeProps(c)} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
  )),
  pin: makeIcon((c) => (
    <>
      <Path {...baseStrokeProps(c)} d="M12 21s-7-7-7-12a7 7 0 0114 0c0 5-7 12-7 12z" />
      <Circle cx="12" cy="9" r="2.5" {...baseStrokeProps(c)} />
    </>
  )),
  pinFill: makeIcon((c) => (
    <>
      <Path fill={c} d="M12 21s-7-7-7-12a7 7 0 0114 0c0 5-7 12-7 12z" />
      <Circle cx="12" cy="9" r="2.5" fill="#fff" />
    </>
  )),
  star: makeIcon((c) => (
    <Path fill={c} d="M12 2l3 6.5 7 .9-5 4.7 1.3 7L12 17.6 5.7 21l1.3-7L2 9.4l7-.9L12 2z" />
  )),
  clock: makeIcon((c) => (
    <>
      <Circle cx="12" cy="12" r="9" {...baseStrokeProps(c)} />
      <Path {...baseStrokeProps(c)} d="M12 7v5l3 2" />
    </>
  )),
  calendar: makeIcon((c) => (
    <>
      <Rect x="3" y="5" width="18" height="16" rx="2" {...baseStrokeProps(c)} />
      <Path {...baseStrokeProps(c)} d="M3 10h18M8 3v4M16 3v4" />
    </>
  )),
  search: makeIcon((c) => (
    <>
      <Circle cx="11" cy="11" r="7" {...baseStrokeProps(c)} />
      <Path {...baseStrokeProps(c)} d="M21 21l-4.5-4.5" />
    </>
  )),
  filter: makeIcon((c) => (
    <Path {...baseStrokeProps(c)} d="M3 5h18M6 12h12M10 19h4" />
  )),
  back: makeIcon((c) => <Path {...baseStrokeProps(c, 1.8)} d="M15 6l-6 6 6 6" />),
  forward: makeIcon((c) => <Path {...baseStrokeProps(c, 1.8)} d="M9 6l6 6-6 6" />),
  more: makeIcon((c) => (
    <>
      <Circle cx="5" cy="12" r="1.6" fill={c} />
      <Circle cx="12" cy="12" r="1.6" fill={c} />
      <Circle cx="19" cy="12" r="1.6" fill={c} />
    </>
  )),
  send: makeIcon((c) => (
    <Path {...baseStrokeProps(c)} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  )),
  play: makeIcon((c) => <Path fill={c} d="M6 4l14 8-14 8V4z" />),
  check: makeIcon((c) => <Path {...baseStrokeProps(c, 2)} d="M5 12l5 5L20 7" />),
  globe: makeIcon((c) => (
    <>
      <Circle cx="12" cy="12" r="9" {...baseStrokeProps(c)} />
      <Path {...baseStrokeProps(c)} d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
    </>
  )),
  list: makeIcon((c) => (
    <Path {...baseStrokeProps(c)} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  )),
  camera: makeIcon((c) => (
    <>
      <Path {...baseStrokeProps(c)} d="M3 8a2 2 0 012-2h2l2-2h6l2 2h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
      <Circle cx="12" cy="13" r="4" {...baseStrokeProps(c)} />
    </>
  )),
  video: makeIcon((c) => (
    <>
      <Rect x="3" y="6" width="13" height="12" rx="2" {...baseStrokeProps(c)} />
      <Path {...baseStrokeProps(c)} d="M16 10l5-3v10l-5-3z" />
    </>
  )),
  text: makeIcon((c) => <Path {...baseStrokeProps(c)} d="M5 6h14M5 12h14M5 18h9" />),
  bell: makeIcon((c) => (
    <Path {...baseStrokeProps(c)} d="M18 16v-5a6 6 0 10-12 0v5l-2 3h16l-2-3zM10 21a2 2 0 004 0" />
  )),
} as const;

export type IconName = keyof typeof Icon;
