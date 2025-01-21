'use client';

import Logo from '@/app/images/logo.svg';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useTranslations } from 'next-intl';
import {
  Gear,
  House,
  UserCircle,
  CircleWavyCheck,
  Exam,
  ListNumbers,
  GraduationCap,
  Books,
  ChartBarHorizontal,
  Notebook,
  IdentificationBadge,
  ChatCenteredText,
} from '@/app/images';
import { Link, usePathname } from '@/i18n/routing';
import { Paragraph } from '@/components/typography/paragraph';
import { TextButton } from '@/components/ui/text-button';
import dayjs from 'dayjs';
import React from 'react';

const createMenuGroups = (t: ReturnType<typeof useTranslations>) => [
  [
    {
      title: t('main'),
      url: '/',
      icon: House,
    },
  ],
  [
    {
      title: t('profile'),
      url: '/profile',
      icon: UserCircle,
    },
    {
      title: t('current-superintendence'),
      url: '/current-superintendence',
      icon: CircleWavyCheck,
    },
    {
      title: t('certification-results'),
      url: '/certification-results',
      icon: Exam,
    },
  ],
  [
    {
      title: t('disciplines'),
      url: '/disciplines',
      icon: ListNumbers,
    },
    {
      title: t('term'),
      url: '/term',
      icon: GraduationCap,
    },
    {
      title: t('methodological-support'),
      url: '/methodological-support',
      icon: Books,
    },
    {
      title: t('poll'),
      url: '/poll',
      icon: ChartBarHorizontal,
    },
    {
      title: t('curriculum'),
      url: '/curriculum',
      icon: Notebook,
    },
    {
      title: t('lecturer-contacts'),
      url: '/lecturer-contacts',
      icon: IdentificationBadge,
    },
  ],
  [
    {
      title: t('feedback'),
      url: '/feedback',
      icon: ChatCenteredText,
    },
    {
      title: t('settings'),
      url: '/settings',
      icon: Gear,
    },
  ],
];

const createSubMenuLinks = (t: ReturnType<typeof useTranslations>) => [
  { title: t('user-manual'), url: '/user-manual' },
  { title: t('faq'), url: '/frequently-asked-questions' },
  { title: t('about'), url: '/about' },
  { title: t('documents'), url: '/kpi-documents' },
  { title: t('terms-of-service'), url: '/terms-of-service' },
  { title: t('contacts'), url: '/contacts' },
];

export function AppSidebar() {
  const t = useTranslations('global.menu');
  const footerT = useTranslations('global');
  const pathname = usePathname();
  const mainMenuGroups = createMenuGroups(t);
  const subMenuLinks = createSubMenuLinks(t);

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent>
        <SidebarHeader className="px-[calc(16px_+_0.5rem)] py-[16px]">
          <Link href="/" className="flex max-h-[48px]">
            <Logo />
          </Link>
        </SidebarHeader>
        <SidebarContent className="gap-0">
          {mainMenuGroups.map((group, index) => (
            <SidebarGroup className="pb-6 [&:not(:first-child)]:pt-6" key={index}>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton isActive={pathname === item.url} asChild>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
          <section className="p-[calc(16px_+_0.5rem)] text-xs text-neutral-600">
            <Paragraph className="my-0 leading-base">
              {subMenuLinks.map((link) => (
                <React.Fragment key={link.url}>
                  <TextButton href={link.url} variant="link" size="small">
                    {link.title}
                  </TextButton>{' '}
                </React.Fragment>
              ))}
            </Paragraph>
            {footerT.rich('footer', {
              kbislink: (chunks) => (
                <Link href={process.env.NEXT_PUBLIC_KBIS_URL!} target="_blank">
                  {chunks}
                </Link>
              ),
              year: dayjs().year(),
              paragraph: (chunks) => <Paragraph className="text-sm">{chunks}</Paragraph>,
            })}
          </section>
        </SidebarContent>
      </SidebarContent>
    </Sidebar>
  );
}
