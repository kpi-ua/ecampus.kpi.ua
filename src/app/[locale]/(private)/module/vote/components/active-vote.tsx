'use client';

import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { submitVote } from '@/actions/vote.actions';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useToast } from '@/hooks/use-toast';
import { VoteData, VoteLecturer } from '@/types/models/vote';

import { LecturerList } from './lecturer-list';
import { VoteForm } from './vote-form';

interface Props {
  initialVoteData: VoteData;
}

export const ActiveVote = ({ initialVoteData }: Props) => {
  const t = useTranslations('private.vote');
  const { errorToast } = useServerErrorToast();
  const { toast } = useToast();
  const [lecturers, setLecturers] = useState(initialVoteData.lecturers);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(
    initialVoteData.lecturers.find((lecturer) => !lecturer.hasVoted)?.employeeId ?? null,
  );
  const [scores, setScores] = useState<Record<number, number>>({});
  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: submitVote,
    retry: false,
    onSuccess: (_, request) => {
      const updatedLecturers = lecturers.map((lecturer) =>
        lecturer.employeeId === request.employeeId ? { ...lecturer, hasVoted: true } : lecturer,
      );
      const nextLecturer = updatedLecturers.find((lecturer) => !lecturer.hasVoted);

      setLecturers(updatedLecturers);
      setSelectedEmployeeId(nextLecturer?.employeeId ?? null);
      setScores({});
      toast({ title: t('success.title'), description: t('success.description') });
    },
    onError: () => errorToast(),
  });

  const selectedLecturer = lecturers.find((lecturer) => lecturer.employeeId === selectedEmployeeId) ?? null;
  const isComplete = initialVoteData.criteria.every((criterion) => scores[criterion.id] !== undefined);

  const selectLecturer = (lecturer: VoteLecturer) => {
    if (lecturer.hasVoted || isSubmitting) {
      return;
    }

    setSelectedEmployeeId(lecturer.employeeId);
    setScores({});
  };

  const handleScoreChange = (criterionId: number, mark: number) => {
    if (isSubmitting) {
      return;
    }
    setScores((current) => ({ ...current, [criterionId]: mark }));
  };

  const handleSubmit = () => {
    if (!selectedLecturer || !isComplete || isSubmitting) {
      return;
    }

    mutate({
      employeeId: selectedLecturer.employeeId,
      scores: initialVoteData.criteria.map((criterion) => ({
        criterionId: criterion.id,
        mark: scores[criterion.id],
      })),
    });
  };

  return (
    <div className="flex flex-col items-start gap-6 lg:flex-row">
      <LecturerList
        lecturers={lecturers}
        selectedEmployeeId={selectedEmployeeId}
        onSelect={selectLecturer}
        disabled={isSubmitting}
      />
      <VoteForm
        criteria={initialVoteData.criteria}
        lecturer={selectedLecturer}
        scores={scores}
        isComplete={isComplete}
        isSubmitting={isSubmitting}
        onScoreChange={handleScoreChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
