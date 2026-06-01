export enum HeaderVariant {
  Main = 'main',
  Dashboard = 'dashboard',
}

export interface HeaderProps {
  className?: string;
  variant: HeaderVariant;
}
