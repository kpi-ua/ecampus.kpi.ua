'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { getCuratorStudents } from '@/actions/curator.actions';
import { CuratorGroup, CuratorStudent } from '@/app/[locale]/(private)/module/kurator/types';

import { CURATOR_GROUP_STALE_TIME, curatorGroupQueryKeys } from '../../query-keys';

export const useGroupLeaderSelect = (group: CuratorGroup) => {
  const [studentId, setStudentId] = useState('');
  const [currentLeader, setCurrentLeader] = useState({ id: group.groupLeaderStudentId, name: group.groupLeaderName });
  const studentsQuery = useQuery({
    queryKey: curatorGroupQueryKeys.students(group.groupId),
    queryFn: () => getCuratorStudents(group.groupId),
    staleTime: CURATOR_GROUP_STALE_TIME,
  });
  const selectedStudent = studentsQuery.data?.find((student) => student.studentId.toString() === studentId);

  useEffect(() => {
    setCurrentLeader({ id: group.groupLeaderStudentId, name: group.groupLeaderName });
    setStudentId('');
  }, [group.groupId, group.groupLeaderStudentId, group.groupLeaderName]);

  const handleAssigned = (student: CuratorStudent) => {
    setCurrentLeader({ id: student.studentId, name: student.fullName });
    setStudentId('');
  };

  return {
    studentId,
    setStudentId,
    currentLeader,
    selectedStudent,
    handleAssigned,
    students: studentsQuery.data ?? [],
    isLoading: studentsQuery.isLoading,
    canAssign: !!selectedStudent && selectedStudent.studentId !== currentLeader.id,
  };
};
