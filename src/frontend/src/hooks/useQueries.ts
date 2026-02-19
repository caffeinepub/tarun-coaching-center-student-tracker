import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Student, Mark, AttendanceRecord, UserProfile } from '../backend';
import { toast } from 'sonner';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

export function useGetStudent() {
  const { actor, isFetching } = useActor();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getStudent(id);
    },
  });
}

export function useAddStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; rollNumber: string; grade: string; contact: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addStudent(data.name, data.rollNumber, data.grade, data.contact);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add student: ${error.message}`);
    },
  });
}

export function useAddMark() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { studentId: bigint; subject: string; examType: string; score: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMark(data.studentId, data.subject, data.examType, data.score);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marks'] });
      toast.success('Mark added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add mark: ${error.message}`);
    },
  });
}

export function useGetMarksByStudent(studentId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Mark[]>({
    queryKey: ['marks', studentId?.toString()],
    queryFn: async () => {
      if (!actor || !studentId) return [];
      return actor.getMarksByStudent(studentId);
    },
    enabled: !!actor && !isFetching && studentId !== null,
  });
}

export function useRecordAttendance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { studentId: bigint; date: string; present: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordAttendance(data.studentId, data.date, data.present);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance recorded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to record attendance: ${error.message}`);
    },
  });
}

export function useGetAttendanceByStudent(studentId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<AttendanceRecord[]>({
    queryKey: ['attendance', 'student', studentId?.toString()],
    queryFn: async () => {
      if (!actor || !studentId) return [];
      return actor.getAttendanceByStudent(studentId);
    },
    enabled: !!actor && !isFetching && studentId !== null,
  });
}

export function useGetAttendanceByDate(date: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<AttendanceRecord[]>({
    queryKey: ['attendance', 'date', date],
    queryFn: async () => {
      if (!actor || !date) return [];
      return actor.getAttendanceByDate(date);
    },
    enabled: !!actor && !isFetching && date !== null,
  });
}
