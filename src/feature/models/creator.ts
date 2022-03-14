export type Creator = {
  id: number;
  name: string;
  avatarUrl?: string;
  dateOfBirth: string;
  age: {
    years: number;
    months: number;
  };
};
