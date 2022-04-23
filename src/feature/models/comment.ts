type Common = {
  message: string;
  user: {
    name: string;
  };
  editPermission: boolean;
};

export type ApiComment = Common & {
  id: string | number;
  user: {
    id: string | number;
    avatarUrl?: string | null;
  };
  createdAt: string;
};

export type Comment = Common & {
  id: string;
  user: {
    id: string;
    avatarUrl?: string;
  };
  createdAt: Date;
};
