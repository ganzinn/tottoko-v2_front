type Common = {
  date: string;
  title?: string;
  creator: {
    name: string;
    dateOfBirth: string;
  };
  tags: string[];
};

type Client = { id: string } & { creator: { id: string } };
type Api = { id: string | number } & { creator: { id: string | number } };

type Index = { indexImageUrl?: string };
type Detail = {
  description?: string;
  scope: {
    value: string;
  };
  detailImageUrls: string[];
  editPermission: boolean;
};

type DetailClient = { scope: { id: string } };
type DetailApi = { scope: { id: string | number } };

export type Work = Common & Client & Index;
export type ApiWork = Common & Api & Index;

export type WorkDetail = Common & Client & Detail & DetailClient;
export type ApiWorkDetail = Common & Api & Detail & DetailApi;

export type Like = {
  count: number;
  alreadyLike: boolean;
};
