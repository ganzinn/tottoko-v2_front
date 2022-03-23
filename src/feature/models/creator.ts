export type Creator = {
  id: string;
  name: string;
  dateOfBirth: string;
  age: {
    years: number;
    months: number;
  };
  avatarUrl?: string;
};

export type CreatorDetail = Omit<Creator, 'avatarUrl'> & {
  gender?: {
    id: string;
    value: string;
  };
  originalAvatarUrl?: string;
  editPermission: boolean;
};

export type CreatorFamily = {
  id: string;
  user: {
    id: string;
    name: string;
  };
  relation: {
    id: string;
    value: string;
  };
  familyRemovePermission: boolean;
};
