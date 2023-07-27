import { QueryEnabled, QueryHandler, Queryable } from '../@types/queries';
import { SceneItem } from '../Scene';

export const makeQueryHandler = (root: SceneItem): QueryHandler => {
  const getQueryFn =
    <T>(
      key: keyof Queryable,
      queryKey: keyof QueryHandler,
      fallback: T,
      process: (item: Queryable | Queryable[] | null) => T
    ) =>
    (value: string): T => {
      let result: T = fallback;

      for (let child of root.children) {
        if (isQueryable(child)) {
          if (child[key] === value) {
            result = process(child);
            break;
          }
        }

        if (isQueryEnabled(child)) {
          const queryResult = child.query[queryKey](value);
          if (queryResult) {
            result = process(queryResult);
            break;
          }
        }
      }

      return result;
    };

  const ensureSingleItem = (itemOrItems: Queryable | Queryable[] | null) => {
    if (Array.isArray(itemOrItems)) {
      return itemOrItems[0] ?? null;
    }

    return itemOrItems;
  };

  const ensureItemArray = (itemOrItems: Queryable | Queryable[] | null) => {
    if (Array.isArray(itemOrItems)) {
      return itemOrItems;
    }

    return itemOrItems ? [itemOrItems] : [];
  };

  return {
    findById: getQueryFn('id', 'findById', null, ensureSingleItem),
    findByName: getQueryFn('name', 'findByName', null, ensureSingleItem),
    findByTag: getQueryFn('tags', 'findByTag', [], ensureItemArray),
    findByType: getQueryFn('type', 'findByType', [], ensureItemArray),
  };
};

const isQueryEnabled = (item: any): item is QueryEnabled =>
  typeof item === 'object' && typeof item.query === 'object';

const isQueryable = (item: any): item is Queryable => {
  return (
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    typeof item.type === 'string'
  );
};
