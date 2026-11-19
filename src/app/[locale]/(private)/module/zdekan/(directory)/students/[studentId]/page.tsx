import { notFound } from 'next/navigation';

import { getDeanOfficeStudent } from '@/actions/dean-office.actions';
import { Card } from '@/components/ui/card';

import { StudentRecordTabs } from '../../../components/student-record-tabs';

interface Props {
  params: Promise<{ studentId: string }>;
}

export default async function DeanOfficeStudentPage({ params }: Props) {
  const { studentId } = await params;
  const id = Number(studentId);

  const student = await getDeanOfficeStudent(id);

  if (!student) {
    notFound();
  }

  return (
    <Card className="col-span-full min-w-0 p-6">
      <h2 className="mb-4 text-xl font-semibold">{student.fullName}</h2>
      <StudentRecordTabs key={id} studentId={id} student={student} />
    </Card>
  );
}
