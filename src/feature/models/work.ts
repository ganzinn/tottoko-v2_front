type CommonWork = {
  title: string;
  date: string;
  creator: {
    name: string;
    dateOfBirth: string;
  };
  indexImageUrl?: string;
  tags: string[];
};
export type Work = CommonWork & { id: string } & { creator: { id: string } };
export type ApiWork = CommonWork & { id: string | number } & {
  creator: { id: string | number };
};
