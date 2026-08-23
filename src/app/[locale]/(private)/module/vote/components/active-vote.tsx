'use client';

import { useTranslations } from 'next-intl';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedLecturer = lecturers.find((lecturer) => lecturer.employeeId === selectedEmployeeId) ?? null;
  const isComplete = initialVoteData.criteria.every((criterion) => scores[criterion.id] !== undefined);

  const selectLecturer = (lecturer: VoteLecturer) => {
    if (lecturer.hasVoted) {
      return;
    }

    setSelectedEmployeeId(lecturer.employeeId);
    setScores({});
  };

  const handleScoreChange = (criterionId: number, mark: number) => {
    setScores((current) => ({ ...current, [criterionId]: mark }));
  };

  const handleSubmit = async () => {
    if (!selectedLecturer || !isComplete) {
      return;
    }

    setIsSubmitting(true);

    try {
      await submitVote({
        employeeId: selectedLecturer.employeeId,
        scores: initialVoteData.criteria.map((criterion) => ({
          criterionId: criterion.id,
          mark: scores[criterion.id],
        })),
      });

      const updatedLecturers = lecturers.map((lecturer) =>
        lecturer.employeeId === selectedLecturer.employeeId ? { ...lecturer, hasVoted: true } : lecturer,
      );
      const nextLecturer = updatedLecturers.find((lecturer) => !lecturer.hasVoted);

      setLecturers(updatedLecturers);
      setSelectedEmployeeId(nextLecturer?.employeeId ?? null);
      setScores({});
      toast({ title: t('success.title'), description: t('success.description') });
    } catch {
      errorToast();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-6 lg:flex-row">
      <LecturerList lecturers={lecturers} selectedEmployeeId={selectedEmployeeId} onSelect={selectLecturer} />
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
