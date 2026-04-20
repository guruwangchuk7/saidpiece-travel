export const STAFF_ROLES = ['admin', 'staff', 'moderator', 'editor'];

export function getStaffEmails(): string[] {
    return (process.env.NEXT_PUBLIC_STAFF_EMAILS || 'saidpiecebhutan@gmail.com,guruwangchuk7@gmail.com,saidpiece@gmail.com')
        .split(',')
        .map(e => e.trim().toLowerCase());
}

export function isEmailStaff(email: string | undefined): boolean {
    if (!email) return false;
    return getStaffEmails().includes(email.toLowerCase());
}
