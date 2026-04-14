import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface DailyContactCount {
    date: string;
    count: bigint;
}
export interface ContactSubmission {
    id: ContactId;
    subject: string;
    name: string;
    email: string;
    message: string;
    timestamp: Timestamp;
}
export type SessionToken = string;
export type ProjectId = bigint;
export type LoginResult = {
    __kind__: "ok";
    ok: SessionToken;
} | {
    __kind__: "err";
    err: string;
};
export type ContactId = bigint;
export interface Project {
    id: ProjectId;
    title: string;
    imageUrls: Array<string>;
    createdAt: Timestamp;
    description: string;
    category: string;
}
export interface DashboardStats {
    contactsLast30Days: Array<DailyContactCount>;
    totalContacts: bigint;
    totalProjects: bigint;
    projectsByCategory: Array<CategoryProjectCount>;
}
export interface CategoryProjectCount {
    count: bigint;
    category: string;
}
export interface backendInterface {
    adminLogin(username: string, password: string): Promise<LoginResult>;
    createProject(token: SessionToken, title: string, description: string, category: string, imageUrls: Array<string>): Promise<Project | null>;
    deleteContact(token: SessionToken, id: ContactId): Promise<boolean>;
    deleteProject(token: SessionToken, id: ProjectId): Promise<boolean>;
    getContactCount(): Promise<bigint>;
    getContacts(token: SessionToken): Promise<Array<ContactSubmission>>;
    getDashboardStats(token: SessionToken): Promise<DashboardStats>;
    getProject(id: ProjectId): Promise<Project | null>;
    getProjects(): Promise<Array<Project>>;
    submitContact(name: string, email: string, subject: string, message: string): Promise<ContactSubmission>;
    updateProject(token: SessionToken, id: ProjectId, title: string, description: string, category: string, imageUrls: Array<string>): Promise<boolean>;
    validateToken(token: string): Promise<boolean>;
}
