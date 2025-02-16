import { Gear, House, UserCircle, CircleWavyCheck, Exam, ChatCenteredText, BagSimple } from '@/app/images';

// TODO: Add icons for modules
export const menuIcon: Map<string, React.ReactNode> = new Map([
  ['main', House],
  ['profile', UserCircle],
  ['current-superintendence', CircleWavyCheck],
  ['certification-results', Exam],
  ['feedback', ChatCenteredText],
  ['employment-system', BagSimple],
  ['settings', Gear],
]);
