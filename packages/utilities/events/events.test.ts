import { describe, expect, it, vi } from 'vitest';
import { makeEventEmitter } from './makeEventEmitter';

describe('EventEmitter', () => {
  describe('on', () => {
    it('should allow to subscribe to events', () => {
      const emitter = makeEventEmitter();
      const callback = vi.fn();

      emitter.on('test', callback);
      emitter.emit('test');

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should return a function to unsubscribe', () => {
      const emitter = makeEventEmitter();
      const callback = vi.fn();

      const off = emitter.on('test', callback);
      off();
      emitter.emit('test');

      expect(callback).toHaveBeenCalledTimes(0);
    });
  });

  describe('once', () => {
    it('should allow to subscribe to events only once', () => {
      const emitter = makeEventEmitter();
      const callback = vi.fn();

      emitter.once('test', callback);
      emitter.emit('test');
      emitter.emit('test');

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should return a function to unsubscribe', () => {
      const emitter = makeEventEmitter();
      const callback = vi.fn();

      const off = emitter.once('test', callback);
      off();
      emitter.emit('test');

      expect(callback).toHaveBeenCalledTimes(0);
    });
  });

  describe('off', () => {
    it('should allow to unsubscribe from events', () => {
      const emitter = makeEventEmitter();
      const callback = vi.fn();

      emitter.on('test', callback);
      emitter.off('test', callback);
      emitter.emit('test');

      expect(callback).toHaveBeenCalledTimes(0);
    });
  });

  describe('emit', () => {
    it('should allow to emit events', () => {
      const emitter = makeEventEmitter();
      const callback = vi.fn();

      emitter.on('test', callback);
      emitter.emit('test');

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to the event listeners', () => {
      const emitter = makeEventEmitter();
      const callback = vi.fn();

      emitter.on('test', callback);
      emitter.emit('test', 1, 2, 3);

      expect(callback).toHaveBeenCalledWith(1, 2, 3);
    });
  });

  describe('clear', () => {
    it('should allow to clear listeners for a specific event', () => {
      const emitter = makeEventEmitter();

      const callbackA = vi.fn();
      emitter.on('testA', callbackA);

      const callbackB = vi.fn();
      emitter.on('testB', callbackB);

      emitter.clear('testA');
      emitter.emit('testA');
      emitter.emit('testB');

      expect(callbackA).toHaveBeenCalledTimes(0);
      expect(callbackB).toHaveBeenCalledTimes(1);
    });

    it('should allow to clear all listeners', () => {
      const emitter = makeEventEmitter();
      const callback = vi.fn();

      emitter.on('test', callback);
      emitter.clear();
      emitter.emit('test');

      expect(callback).toHaveBeenCalledTimes(0);
    });
  });
});
