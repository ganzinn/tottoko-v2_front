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

export type ApiCreator = Omit<Creator, 'id'> & { id: string | number };

export type CreatorDetail = Omit<Creator, 'avatarUrl'> & {
  gender?: {
    id: string;
    value: string;
  };
  originalAvatarUrl?: string;
  editPermission: boolean;
};

export type ApiCreatorDetail = Omit<CreatorDetail, 'id'> & {
  id: string | number;
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

export type ApiCreatorFamily = {
  id: string | number;
  user: {
    id: string | number;
    name: string;
  };
  relation: {
    id: string | number;
    value: string;
  };
  familyRemovePermission: boolean;
};
