type ErrMessages = string[];

export const isErrMessages = (arg: unknown): arg is ErrMessages => {
  const b = arg as ErrMessages;

  return Array.isArray(b) && b.every((i) => typeof i === 'string');
};
