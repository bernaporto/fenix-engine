import { isNotNullable } from '@fenix-engine/utilities/misc';
import { parallel } from '@fenix-engine/utilities/functional';
import { AnyContext } from '../@types';
import {
  applyBindingValue,
  getBindingKeys,
  isReadonlyObservable,
} from '../utils';

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

  throw new Error(`Unknown node type: ${node}`);
};

export const applyContextToElement = (
  element: HTMLElement,
  context: AnyContext
): Unsubscriber => {
  // console.log('applyContextToElement', element, context);
  return noop;
};

export const applyContextToText = (
  text: Text,
  context: AnyContext
): Unsubscriber => {
  const content = text.textContent?.trim().replace(/^\r?\n|\r/, '');
  if (!content) return noop;

  const applyEntry = (key: string, value: unknown) => {
    text.textContent = applyBindingValue(content, key, value);
  };

  const usedKeys = getBindingKeys(content);

  return parallel(
    ...Object.entries(context)
      .map(([key, value]) => {
        if (!usedKeys.includes(key)) return;

        if (!isReadonlyObservable(value)) {
          applyEntry(key, value);
          return null;
        }

        applyEntry(key, value.get());

        return value.subscribe((newValue: unknown) => {
          applyEntry(key, newValue);
        });
      })
      .filter(isNotNullable)
  );
};
