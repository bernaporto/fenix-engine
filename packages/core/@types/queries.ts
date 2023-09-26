export type Queryable = {
  id: string;
  type: string;
  name?: string;
  tags?: string[];
  behaviours?: string[];
};

export type QueryEnabled = {
  query: QueryHandler;
};

export type QueryHandler = {
  findByBehaviour(behaviour: string): Queryable[];
  findById(id: string): Queryable | null;
  findByName(name: string): Queryable | null;
  findByTag(tag: string): Queryable[];
  findByType(type: string): Queryable[];
};
