import { colors } from '@/theme';
import { icons, type IconName } from './icons';

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

export function Icon({ name, size = 24, color = colors.text }: IconProps) {
  const SvgIcon = icons[name];
  return <SvgIcon width={size} height={size} color={color} preserveAspectRatio="xMidYMid meet" />;
}

export type { IconName };
