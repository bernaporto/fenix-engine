import type { Group, Object3D } from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import { Loader } from '../Loader';
import type { SkinnedObject } from '../types';
import { Prop, PropConfig } from './Prop';
import { Puppet, PuppetConfig } from './Puppet';

type FactoryProps = {
  assetUrl: string;
  preload?: boolean;
};
type InstantiateParameters = Omit<PropConfig | PuppetConfig, 'assetPromise'>;

type InstantiateProps<P extends InstantiateParameters> = Omit<
  P,
  'assetPromise'
>;

type BaseFactoryProps<T, P extends InstantiateParameters, U> = FactoryProps & {
  instantiate: (props: InstantiateProps<P>, assetPromise: Promise<U>) => T;
  load: (assetUrl: string) => Promise<U>;
};

// BASE UNIT FACTORY
class BaseFactory<T, P extends InstantiateParameters, U> {
  private _preloadPromise: Promise<U> | null = null;

  constructor(private props: BaseFactoryProps<T, P, U>) {
    const { preload = true } = props;

    if (preload) {
      this._preloadPromise = this.load();
    }
  }

  protected load(): Promise<U> {
    const { assetUrl, load } = this.props;

    if (!this._preloadPromise) {
      this._preloadPromise = load(assetUrl);
    }

    return this._preloadPromise;
  }

  public instantiate(props: P): T {
    return this.props.instantiate(props, this.load());
  }
}

// PROP FACTORY
export class PropFactory extends BaseFactory<
  Prop,
  Omit<PropConfig, 'assetPromise'>,
  Object3D
> {
  constructor(props: FactoryProps) {
    super({
      ...props,
      instantiate: (props, assetPromise) =>
        new Prop({
          ...props,
          assetPromise: assetPromise.then(cloneObject),
        }),
      load: (assetUrl) => Loader.loadObject(assetUrl),
    });
  }
}

// ANIMATED Unit FACTORY
export class PuppetFactory extends BaseFactory<
  Puppet,
  Omit<PuppetConfig, 'assetPromise'>,
  SkinnedObject
> {
  constructor(props: FactoryProps) {
    super({
      ...props,
      instantiate: (props, loadPromise) =>
        new Puppet({
          ...props,
          assetPromise: loadPromise.then(cloneSkinnedObject),
        }),
      load: (assetUrl) => Loader.loadSkinnedObject(assetUrl),
    });
  }
}

// UTILS
const cloneObject = (obj: Object3D): Object3D => obj.clone();

const cloneSkinnedObject = ({
  animations,
  root,
}: SkinnedObject): SkinnedObject => ({
  animations,
  root: SkeletonUtils.clone(root) as Group,
});
