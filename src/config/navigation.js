import { services } from './services.js';

export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Sobre nós', href: '/sobre-nos/' },
  {
    label: 'Serviços', href: '/servicos/',
    children: [...services.map(({ label, href }) => ({ label, href })), { label: 'Ver todos os serviços', href: '/servicos/' }],
  },
  { label: 'Contato', href: '/contato/' },
];

export function getNavigationCurrent(href, pathname) {
  if (href.includes('#')) return undefined;
  if (pathname === href) return 'page';
  if (href === '/servicos/' && pathname.startsWith(href)) return 'location';
  return undefined;
}
