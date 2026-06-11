export enum IconName {
  Edit = 'edit',
  Telegram = 'telegram',
  Close = 'close',
  Info = 'info',
  Settings = 'settings',
  Book = 'book',
  Audio = 'audio',
  Video = 'video',
  Logo = 'logo',
  VerticalLine = 'vertical-line',
  TextLogo = 'header',
  Arrow = 'arrow',
  Search = 'search',
  Avatar = 'avatar',
  Hamburger = 'hamburger',
  Plus = 'plus',
  Copy = 'copy',
}

export interface IconProps {
  name: IconName;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}
