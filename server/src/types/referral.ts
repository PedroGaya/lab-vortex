export type Referral = {
  id: string;
  fromUserId: string;
  followedThrough: boolean;
};

export type ReferralParams = {
  refCode: string;
  followedThrough: boolean;
};
