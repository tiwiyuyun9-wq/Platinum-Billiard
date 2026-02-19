export type MembershipTier = 'standard' | 'silver' | 'gold' | 'platinum';

export interface Membership {
    id: string;
    user_id: string;
    tier: MembershipTier;
    start_date: string;
    end_date: string;
    is_active: boolean;
}
