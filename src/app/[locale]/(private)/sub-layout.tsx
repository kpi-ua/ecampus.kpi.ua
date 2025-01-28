'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useLocalStorage } from '@/hooks/use-storage';
import { User } from '@/types/user';
import CodeOfHonorAlert from '@/components/code-of-honor-alert';

interface SubLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: string[][];
  pageTitle: string;
  className?: string;
}

export const SubLayout = ({ children, breadcrumbs = [], pageTitle, className }: SubLayoutProps) => {
  const t = useTranslations('global.menu');
  const [user] = useLocalStorage<User>('user');

  if (!user?.codeOfHonorSignDate) {
    return <CodeOfHonorAlert />;
  }

  return (
    <section>
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{t('main')}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {breadcrumbs.map(([url, title]) => (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href={url}>{title}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          ))}
          <BreadcrumbItem>
            <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className={cn('grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]', className)}>{children}</section>
    </section>
  );
};
