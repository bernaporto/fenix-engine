import { getAllPaths, getFromPath } from '@fenix-engine/utilities/store/utils';
import { isNotNullable } from '@fenix-engine/utilities/misc';
import { parallel } from '@fenix-engine/utilities/functional';
import type { VoidFunction } from '@fenix-engine/utilities/@types';
import { AnyContext } from '../@types';
import {
  applyDataBindingValue,
  getAttributeMap,
  getBindingKeys,
  isReadonlyObservable,
} from '../utils';
import { EVENT_BINDING_ATTRS, EVENT_BINDING_REGEX } from '../constants';

type Unsubscriber = VoidFunction;
const noop = () => {
  /* noop */
};

export const applyContextToTree = (
  root: Node,
  context: AnyContext
): Unsubscriber => {
  const subscriptions = new Set<VoidFunction>();

  subscriptions.add(applyContextToNode(root, context));

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ALL);
  let node = walker.nextNode();

  while (node) {
    subscriptions.add(applyContextToNode(node, context));
    node = walker.nextNode();
  }

  return parallel(...subscriptions);
};

const applyContextToNode = (node: Node, context: AnyContext): Unsubscriber => {
  if (node instanceof HTMLElement) {
    return applyContextToElement(node, context);
  }

  if (node instanceof Text) {
    return applyContextToText(node, context);
  }

  console.warn(`Unknown node type: ${node}`);
  return noop;
};

/* HTML ELEMENT ATTRIBUTES */
export const applyContextToElement = (
  element: HTMLElement,
  context: AnyContext
): Unsubscriber =>
  parallel(
    /* EVENT BINDING */
    ...EVENT_BINDING_ATTRS.map((attrKey) => {
      const attrValue = element.getAttribute(attrKey);
      if (!attrValue) return null;

      // Event binding should only allow one key binding and it should be a function
      const contextValue = getFromPath(context, attrValue);
      if (typeof contextValue !== 'function') {
        throw new Error(
          `Event binding should only allow function values, got ${typeof contextValue} from '${attrValue}'`
        );
      }

      const eventName = attrKey.replace(EVENT_BINDING_REGEX, '$1');
      const callback = () => contextValue();
      element.addEventListener(eventName as any, callback);

      return () => element.removeEventListener(eventName as any, callback);
    }).filter(isNotNullable),

    /* DATA BINDING */
    ...Object.entries(getAttributeMap(element)).map(([attrKey, attrValue]) => {
      return setupBinding(attrValue, context, (contextKey, contextValue) => {
        const newValue = applyDataBindingValue(
          attrValue,
          contextKey,
          contextValue
        );
        element.setAttribute(attrKey, newValue);
      });
    })
  );

/* TEXT NODES CONTENT */
export const applyContextToText = (
  text: Text,
  context: AnyContext
): Unsubscriber => {
  const content = text.textContent?.trim().replace(/^\r?\n|\r/, '');
  if (!content) return noop;

  return setupBinding(content, context, (key, value) => {
    text.textContent = applyDataBindingValue(content, key, value);
  });
};

/* HELPERS */
const setupBinding = (
  content: string,
  context: AnyContext,
  applyEntry: (key: string, value: unknown) => void
): VoidFunction => {
  const usedKeys = getBindingKeys(content);

  return parallel(
    ...getAllPaths(context)
      .map((path) => {
        if (!usedKeys.includes(path)) return null;

        const value = getFromPath(context, path);

        if (!isReadonlyObservable(value)) {
          applyEntry(path, value);
          return null;
        }

        applyEntry(path, value.get());

        return value.subscribe((newValue: unknown) => {
          applyEntry(path, newValue);
        });
      })
      .filter(isNotNullable)
  );
};
