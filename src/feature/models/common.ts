export type Pagination = {
  totalCount: number;
  limitValue: number;
  totalPages: number;
  currentPage: number;
};

export const isPagination = (arg: unknown): arg is Pagination => {
  const b = arg as Pagination;

  return (
    typeof b.totalCount === 'number' &&
    typeof b.limitValue === 'number' &&
    typeof b.totalPages === 'number' &&
    typeof b.currentPage === 'number'
  );
};
