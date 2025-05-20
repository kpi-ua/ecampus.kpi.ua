import React from 'react';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading3, Heading4, Heading6 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { Card } from '@/components/ui/card';

export default function CuratorPage() {
  const photoUrl = null;

  return (
    <SubLayout pageTitle="Куратор">
      <div className="col-span-8">
        <Heading2>Куратор</Heading2>
        <Paragraph className="mb-[28px] mt-[12px] w-[624px] text-sm font-normal leading-sm text-neutral-700">
          У цьому представлено офіційну інформацію про вашого куратора, зокрема займані посади, кафедри, контактні дані
          та посилання на персональну сторінку.
        </Paragraph>
        <Card className="rounded-b-6 col-span-full flex w-full flex-col gap-[24px] bg-white p-[36px] xl:col-span-5">
          <div className="flex items-center gap-[24px]">
            <div className="flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-full bg-brand-100">
              {photoUrl ? (
                <img src={photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <Heading3 className="text-basic-green">Ж</Heading3>
              )}
            </div>
            <Heading4 className="text-basic-black">Жураковський Богдан Юрійович</Heading4>
          </div>
          <div className="flex flex-col gap-[12px]">
            <Heading6>Інформація про куратора</Heading6>
            <hr />
            <div className="flex flex-col gap-[16px]">
              <div className="flex gap-[24px]">
                <Paragraph className="m-0 w-[170px] text-lg font-semibold text-neutral-400">Посада(и):</Paragraph>
                <div className="flex flex-col gap-[8px]">
                  <Paragraph className="m-0 text-lg font-normal text-basic-black">
                    Професор (Кафедра технічної кібернетики ФІОТ)
                  </Paragraph>
                  <Paragraph className="m-0 text-lg font-normal text-basic-black">
                    Професор (Кафедра інформаційних систем та технологій ФІОТ)
                  </Paragraph>
                  <Paragraph className="m-0 text-lg font-normal text-basic-black">
                    Професор (Кафедра інформатики та програмної інженерії ФІОТ)
                  </Paragraph>
                </div>
              </div>
              <div className="flex flex-col gap-[8px]">
                <Paragraph className="m-0 text-lg font-semibold text-neutral-400">Контакти:</Paragraph>
                <div className="flex gap-[24px]">
                  <Paragraph className="m-0 w-[170px] pl-[16px] text-lg font-semibold text-neutral-400">
                    E-mail
                  </Paragraph>
                  <Paragraph className="m-0 text-lg font-normal text-basic-black">
                    inna.stetsenko-fiotellL.kpi.ua
                  </Paragraph>
                </div>
                <div className="flex gap-[24px]">
                  <Paragraph className="m-0 w-[170px] pl-[16px] text-lg font-semibold text-neutral-400">
                    Orcid ID
                  </Paragraph>
                  <Paragraph className="m-0 text-lg font-normal text-basic-black">0000-0002-4601-0058</Paragraph>
                </div>
                <div className="flex gap-[24px]">
                  <Paragraph className="m-0 w-[170px] pl-[16px] text-lg font-semibold text-neutral-400">
                    Research ID
                  </Paragraph>
                  <Paragraph className="m-0 text-lg font-normal text-basic-black">C-1512-2019</Paragraph>
                </div>
                <div className="flex gap-[24px]">
                  <Paragraph className="m-0 w-[170px] pl-[16px] text-lg font-semibold text-neutral-400">
                    Scopus ID
                  </Paragraph>
                  <Paragraph className="m-0 text-lg font-normal text-basic-black">55368781500</Paragraph>
                </div>
                <div className="flex gap-[24px]">
                  <Paragraph className="m-0 w-[170px] pl-[16px] text-lg font-semibold text-neutral-400">
                    Google Scholar
                  </Paragraph>
                  <Paragraph className="m-0 text-lg font-normal text-basic-black">505г-kkAAAAJ</Paragraph>
                </div>
              </div>
              <div className="flex gap-[24px]">
                <Paragraph className="m-0 w-[170px] text-lg font-semibold text-neutral-400">
                  Особиста сторінка:
                </Paragraph>
                <Paragraph className="m-0 text-lg font-normal text-basic-black">
                  <a href="#">zby3</a>
                </Paragraph>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </SubLayout>
  );
}
