export type FooterLinkItem = {
  label: string;
  href: string;
};

export function footerSearchHref() {
  return '/search?listingType=SALE&customsCleared=true';
}

export const footerNavigationLinks: FooterLinkItem[] = [
  { label: 'myPage', href: '#' },
  { label: 'vinCheck', href: '#' },
  { label: 'carService', href: '#' },
  { label: 'disassembledCars', href: '#' },
  { label: 'videoTrafficFines', href: '#' },
  { label: 'tbilisiParking', href: '#' },
  { label: 'registrationCalculator', href: '#' },
  { label: 'advertisements', href: '#' },
];

export const footerHelpLinks: FooterLinkItem[] = [
  { label: 'email', href: 'mailto:info@autoshop.com' },
  { label: 'contacts', href: '/contacts' },
  { label: 'faq', href: '/help#faq' },
  { label: 'sendMessage', href: '/help#contact' },
  { label: 'requestCall', href: 'tel:+995322800045' },
  { label: 'phone', href: 'tel:+995322800045' },
  { label: 'anonymousFeedback', href: '#' },
];

export const footerSocialLinks = [
  { id: 'facebook', href: 'https://facebook.com', label: 'Facebook' },
  { id: 'instagram', href: 'https://instagram.com', label: 'Instagram' },
  { id: 'linkedin', href: 'https://linkedin.com', label: 'LinkedIn' },
] as const;

export const footerCategoryColumns = ['column1', 'column2', 'column3'] as const;
