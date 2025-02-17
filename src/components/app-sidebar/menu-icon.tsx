import {
  Gear,
  House,
  UserCircle,
  CircleWavyCheck,
  Exam,
  ChatCenteredText,
  BagSimple,
  ListNumbers,
  GraduationCap,
  Books,
  ChartBarHorizontal,
  IdentificationBadge,
  Scroll,
} from '@/app/images';

// TODO: Add icons for modules
export const menuIcon: Map<string, React.ReactNode> = new Map([
  ['main', House],
  ['profile', UserCircle],
  ['current-superintendence', CircleWavyCheck],
  ['certification-results', Exam],
  ['msg', ChatCenteredText],
  ['employment', BagSimple],
  ['settings', Gear],
  ['sdchoice2021admin', ListNumbers],
  ['sdchoice2021moderator', ListNumbers],
  ['sdchoice2021nmv', ListNumbers],
  ['vedomost', GraduationCap],
  ['mob', Books],
  ['vote', ChartBarHorizontal],
  ['contacts', IdentificationBadge],
  ['notice-board', Scroll],
]);
