import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useAuth } from './useAuth';
import type { Student, Mark, AttendanceRecord, UserProfile } from '../backend';
import { toast } from 'sonner';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { token } = useAuth();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile', token],
    queryFn: async () => {
      if (!actor || !token) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!token,
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

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { token } = useAuth();

  return useQuery<boolean>({
    queryKey: ['isAdmin', token],
    queryFn: async () => {
      if (!actor || !token) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching && !!token,
    retry: false,
  });
}

export function useGetStudent() {
  const { actor } = useActor();

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

export function useGetAllSubjects() {
  const { actor, isFetching } = useActor();
  const { token } = useAuth();

  return useQuery<string[]>({
    queryKey: ['subjects', token],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubjects();
    },
    enabled: !!actor && !isFetching && !!token,
  });
}

export function useAddSubject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subjectName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSubject(subjectName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add subject: ${error.message}`);
    },
  });
}

export function useEditSubject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { oldSubject: string; newSubject: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editSubject(data.oldSubject, data.newSubject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      queryClient.invalidateQueries({ queryKey: ['marks'] });
      toast.success('Subject updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update subject: ${error.message}`);
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
  const { actor, isFetching: actorFetching } = useActor();
  const { token } = useAuth();

  return useQuery<Mark[]>({
    queryKey: ['marks', studentId?.toString(), token],
    queryFn: async () => {
      if (!actor || !studentId) return [];
      return actor.getMarksByStudent(studentId);
    },
    enabled: !!actor && !actorFetching && !!studentId && !!token,
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
  const { actor, isFetching: actorFetching } = useActor();
  const { token } = useAuth();

  return useQuery<AttendanceRecord[]>({
    queryKey: ['attendance', studentId?.toString(), token],
    queryFn: async () => {
      if (!actor || !studentId) return [];
      return actor.getAttendanceByStudent(studentId);
    },
    enabled: !!actor && !actorFetching && !!studentId && !!token,
  });
}

export function useGetAttendanceByDate() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (date: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAttendanceByDate(date);
    },
  });
}
