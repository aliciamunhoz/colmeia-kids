import Alert from '../../../assets/icons/alert.svg';
import Back from '../../../assets/icons/back.svg';
import Bell from '../../../assets/icons/bell.svg';
import Building from '../../../assets/icons/building.svg';
import Calendar from '../../../assets/icons/calendar.svg';
import Camera from '../../../assets/icons/camera.svg';
import Card from '../../../assets/icons/card.svg';
import Chart from '../../../assets/icons/chart.svg';
import Chat from '../../../assets/icons/chat.svg';
import Check from '../../../assets/icons/check.svg';
import Chevdown from '../../../assets/icons/chevdown.svg';
import Chevron from '../../../assets/icons/chevron.svg';
import Clip from '../../../assets/icons/clip.svg';
import Clock from '../../../assets/icons/clock.svg';
import Door from '../../../assets/icons/door.svg';
import Download from '../../../assets/icons/download.svg';
import Droplet from '../../../assets/icons/droplet.svg';
import Edit from '../../../assets/icons/edit.svg';
import Euro from '../../../assets/icons/euro.svg';
import Eye from '../../../assets/icons/eye.svg';
import File from '../../../assets/icons/file.svg';
import Filter from '../../../assets/icons/filter.svg';
import Heart from '../../../assets/icons/heart.svg';
import Home from '../../../assets/icons/home.svg';
import Image from '../../../assets/icons/image.svg';
import Lock from '../../../assets/icons/lock.svg';
import Login from '../../../assets/icons/login.svg';
import Logout from '../../../assets/icons/logout.svg';
import Mail from '../../../assets/icons/mail.svg';
import Megaphone from '../../../assets/icons/megaphone.svg';
import Menu from '../../../assets/icons/menu.svg';
import Moon from '../../../assets/icons/moon.svg';
import More from '../../../assets/icons/more.svg';
import Nav from '../../../assets/icons/nav.svg';
import Palette from '../../../assets/icons/palette.svg';
import Phone from '../../../assets/icons/phone.svg';
import Pin from '../../../assets/icons/pin.svg';
import Plus from '../../../assets/icons/plus.svg';
import Qr from '../../../assets/icons/qr.svg';
import Search from '../../../assets/icons/search.svg';
import Send from '../../../assets/icons/send.svg';
import Settings from '../../../assets/icons/settings.svg';
import Shield from '../../../assets/icons/shield.svg';
import Smile from '../../../assets/icons/smile.svg';
import Sprout from '../../../assets/icons/sprout.svg';
import Star from '../../../assets/icons/star.svg';
import Sun from '../../../assets/icons/sun.svg';
import Toy from '../../../assets/icons/toy.svg';
import Trash from '../../../assets/icons/trash.svg';
import User from '../../../assets/icons/user.svg';
import Users from '../../../assets/icons/users.svg';
import Utensils from '../../../assets/icons/utensils.svg';
import Video from '../../../assets/icons/video.svg';
import X from '../../../assets/icons/x.svg';

export const icons = {
  alert: Alert,
  back: Back,
  bell: Bell,
  building: Building,
  calendar: Calendar,
  camera: Camera,
  card: Card,
  chart: Chart,
  chat: Chat,
  check: Check,
  chevdown: Chevdown,
  chevron: Chevron,
  clip: Clip,
  clock: Clock,
  door: Door,
  download: Download,
  droplet: Droplet,
  edit: Edit,
  euro: Euro,
  eye: Eye,
  file: File,
  filter: Filter,
  heart: Heart,
  home: Home,
  image: Image,
  lock: Lock,
  login: Login,
  logout: Logout,
  mail: Mail,
  megaphone: Megaphone,
  menu: Menu,
  moon: Moon,
  more: More,
  nav: Nav,
  palette: Palette,
  phone: Phone,
  pin: Pin,
  plus: Plus,
  qr: Qr,
  search: Search,
  send: Send,
  settings: Settings,
  shield: Shield,
  smile: Smile,
  sprout: Sprout,
  star: Star,
  sun: Sun,
  toy: Toy,
  trash: Trash,
  user: User,
  users: Users,
  utensils: Utensils,
  video: Video,
  x: X,
} as const;

export type IconName = keyof typeof icons;
