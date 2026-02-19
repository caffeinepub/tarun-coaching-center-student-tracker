import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Mark {
    studentId: bigint;
    subject: string;
    score: bigint;
    examType: string;
}
export interface AttendanceRecord {
    studentId: bigint;
    present: boolean;
    date: string;
}
export interface UserProfile {
    name: string;
    role: string;
}
export interface Student {
    id: bigint;
    contact: string;
    name: string;
    grade: string;
    rollNumber: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMark(studentId: bigint, subject: string, examType: string, score: bigint): Promise<void>;
    addStudent(name: string, rollNumber: string, grade: string, contact: string): Promise<bigint>;
    addSubject(subjectName: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    editSubject(oldSubject: string, newSubject: string): Promise<void>;
    getAllSubjects(): Promise<Array<string>>;
    getAttendanceByDate(date: string): Promise<Array<AttendanceRecord>>;
    getAttendanceByStudent(studentId: bigint): Promise<Array<AttendanceRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMarksByStudent(studentId: bigint): Promise<Array<Mark>>;
    getStudent(id: bigint): Promise<Student>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordAttendance(studentId: bigint, date: string, present: boolean): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
