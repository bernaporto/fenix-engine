export type Queryable = {
  id: string;
  type: string;
  name?: string;
  tags?: string[];
};

export type QueryEnabled = {
  query: QueryHandler;
};

export type QueryHandler = {
  findById(id: string): Queryable | null;
  findByName(name: string): Queryable | null;
  findByTag(tag: string): Queryable[];
  findByType(type: string): Queryable[];
};
