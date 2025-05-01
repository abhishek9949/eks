export interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  selectedHeaderLink: string;
  handleHeaderLinkSelect: (headerLink: string) => void;
  showNotification: boolean;
  toggleNotification: () => void;
}

export interface HeaderLinksProps {
  selectedHeaderLink: string;
  handleHeaderLinkSelect: (headerLink: string) => void;
  isSidebar?: boolean;
}

export interface PricingCardDetails {
  planType: string;
  isPopular: boolean;
  description: string;
  amount: string;
  currency: string;
  features: string[];
}

export interface IndividualPricingCardProps {
  pricingDetails: PricingCardDetails;
  forTitle: string;
}

export interface GetStartedButtonProps {
  customClassname: string;
  showIcon?: boolean;
  title: string;
  customClassnameForLink?: string;
  customClassnameForGap?: string;
  customClassnameForArrow?: string;
  isBlue?: boolean;
  customLink?: string;
}

export interface GettingStartedCardProps {
  item: {
    title: string;
    description: string;
    image: string;
  };
}

export interface PricingCardForCarouselProps {
  activeStep: number;
  pricingDetails: PricingCardDetails[];
  forTitle: string;
  handleStepChange: (direction: string) => void;
}
