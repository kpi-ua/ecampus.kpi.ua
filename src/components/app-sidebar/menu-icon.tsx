import { Gear, House, UserCircle, CircleWavyCheck, Scroll, Exam, ChatCenteredText, BagSimple } from '@/app/images';

// TODO: Add icons for modules
export const menuIcon: Map<string, React.ReactNode> = new Map([
  ['main', House],
  ['profile', UserCircle],
  ['current-superintendence', CircleWavyCheck],
  ['certification-results', Exam],
  ['feedback', ChatCenteredText],
  ['employment-system', BagSimple],
  ['settings', Gear],
  ['notice-board', Scroll],
]);
