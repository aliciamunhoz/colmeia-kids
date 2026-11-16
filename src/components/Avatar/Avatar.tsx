import { avatars, type AvatarName } from './avatars';

type AvatarProps = {
  name: AvatarName;
  size?: number;
};

export function Avatar({ name, size = 80 }: AvatarProps) {
  const SvgAvatar = avatars[name];
  const height = name === 'bee' ? size * (104 / 120) : size;
  return <SvgAvatar width={size} height={height} preserveAspectRatio="xMidYMid meet" />;
}

export type { AvatarName };
