export interface ISingleReferenceType<T> {
  version: () => number;
  living: (value: { [key: number]: boolean }) => void;
  add: (id: number, value: any) => void;
  remove: (id: number, allRefs?: boolean) => void;
  clear: () => void;
  has: (id: number) => boolean;
  get: (id: number) => T | undefined;
  set: (id: number, value: T) => void;
  forEach: (callback: (value: T, id: number) => void) => void;
  map: <I extends {}>(callback: (value: T, id: number) => I) => I[];
  values: (callback: (value: T) => void) => void;
  [key: number]: T;
}

export default function SingleReferenceComponent(): ISingleReferenceType<
  number
> {
  let living: { [key: number]: boolean } = {};
  let keyToValue: Array<number | null> = [];
  let valueToKey: Array<number | null> = [];

  let version = 0;
  return new Proxy(
    {
      living: (value: { [key: number]: boolean }) => (living = value),
      version: () => version,
      clear: () => {
        keyToValue = [];
        valueToKey = [];
        version += 1;
      },

      add: (key: number, value: any) => {
        version += 1;
        keyToValue[key] = value;
        const oldKey = valueToKey[value];
        if (oldKey != null && oldKey !== key) {
          keyToValue[oldKey] = null;
        }
        valueToKey[value] = key;
      },

      remove: (id: number, allRefs: boolean) => {
        const value = keyToValue[id];
        if (value) {
          version += 1;
          valueToKey[value] = null;
          keyToValue[id] = null;
        }

        if (allRefs) {
          if (!value) {
            version += 1;
          }
          const key = valueToKey[id];
          if (key) {
            keyToValue[key] = null;
            valueToKey[id] = null;
          }
        }
      },
      has: (id: number) => keyToValue[id] != null,
      get: (id: number) => (keyToValue[id] != null && keyToValue[id]) || void 0,
      set: (key: number, value: number) => {
        version += 1;
        keyToValue[key] = value;
        const oldKey = valueToKey[value];
        if (oldKey != null && oldKey !== key) {
          keyToValue[oldKey] = null;
        }
        valueToKey[key] = value;
      },
      forEach: (callback: (value: number, id: number) => void) => {
        keyToValue.forEach((value, key) => {
          return (
            value != null &&
            living[key] &&
            living[value] &&
            callback(value, key)
          );
        });
      },

      map: (callback: (value: number, id: number) => any) => {
        return keyToValue
          .filter((value, key) => value != null && living[key] && living[value])
          .map((value, key) => {
            return callback(value as number, key);
          });
      },
      values: (callback: (value: number) => any) => {
        for (const v of keyToValue) {
          v != null && living[v] && callback(v);
        }
      }
    },
    {
      get: (target: any, name: number) => {
        return (
          target[name] ||
          (keyToValue[name] != null && keyToValue[name]) ||
          void 0
        );
      },

      set: (_: any, name: number, value: number) => {
        version += 1;
        keyToValue[name] = value;
        const oldKey = valueToKey[value];
        if (oldKey != null && oldKey !== name) {
          keyToValue[oldKey] = null;
        }
        valueToKey[value] = name;
        return true;
      }
    }
  );
}
