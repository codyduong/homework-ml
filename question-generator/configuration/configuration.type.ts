// TODO: generate schema automatically

export type Configuration = {
  options: {
    exportErrors: boolean;
  };
  runs: { function: string; parameters: any }[];
};
