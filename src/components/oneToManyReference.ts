export interface IMultiComponentType<T> {
  living: (value: { [key: number]: boolean }) => void;
  version: () => number;
  size: () => number;
  add: (id: number, value: any) => void;
  remove: (id: number, allRefs?: boolean) => void;
  clear: () => void;
  has: (id: number) => boolean;
  get: (id: number) => Set<T> | undefined;
  set: (id: number, value: T) => void;
  forEach: (callback: (value: T, id: number) => void) => void;
  map: <I extends {}>(callback: (value: T, id: number) => I) => I[];
  updateValue: (callback: (value: T) => T) => void;
  values: (callback: (value: T) => void) => void;
  [key: number]: Set<T> | number;
}

export default function OneToManyReference(): IMultiComponentType<number> {
  let living: { [key: number]: boolean } = {};
  let keyToValue: Array<Set<number> | null> = [];
  let valueToKey: Array<number | null> = [];

  let version = 0;
  return new Proxy(
    {
      living: (value: { [key: number]: boolean }) => (living = value),
      version: () => version,
      size: () => {
        throw new Error("Operation Not Supported");
      },
      clear: () => {
        keyToValue = [];
        valueToKey = [];
        version += 1;
      },

      add: (key: number, value: any) => {
        version += 1;
        const entry = keyToValue[key];
        if (entry) {
          entry.add(value);
        } else {
          keyToValue[key] = new Set([value]);
        }
        const oldKey = valueToKey[value];
        if (oldKey != null) {
          (keyToValue[oldKey] as Set<number>).delete(value);
        }
        valueToKey[value] = key;
      },

      remove: (id: number, allRefs: boolean) => {
        const values = keyToValue[id];
        if (values) {
          version += 1;
          values.forEach(v => (valueToKey[v] = null));
          keyToValue[id] = null;
        }

        if (allRefs) {
          if (!values) {
            version += 1;
          }
          const key = valueToKey[id];
          if (key) {
            (keyToValue[key] as Set<number>).delete(id);
            valueToKey[id] = null;
          }
        }
      },
      has: (id: number) => keyToValue[id] != null,
      get: (id: number) => (keyToValue[id] != null && keyToValue[id]) || void 0,
      set: (key: number, value: number) => {
        version += 1;
        const entry = keyToValue[key];
        if (entry) {
          entry.add(value);
        } else {
          keyToValue[key] = new Set([value]);
        }
        const oldKey = valueToKey[value];
        if (oldKey != null) {
          (keyToValue[oldKey] as Set<number>).delete(value);
        }
        valueToKey[value] = key;
      },
      forEach: (callback: (value: number, id: number) => void) => {
        keyToValue.forEach((value, key) => {
          if (value != null && living[key]) {
            value.forEach(v => living[key] && callback(v, key));
          }
        });
      },

      map: (_: (value: number, id: number) => any) => {
        throw new Error("Operation Not Supported");
      },
      values: (_: (value: number) => any) => {
        throw new Error("Operation Not Supported");
      },
      updateValue: (_: (value: number) => number) => {
        throw new Error("Operation Not Supported");
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
        const entry = keyToValue[name];
        if (entry) {
          entry.add(value);
        } else {
          keyToValue[name] = new Set([value]);
        }
        const oldKey = valueToKey[value];
        if (oldKey != null) {
          keyToValue[oldKey] = null;
        }
        valueToKey[value] = name;
        return true;
      }
    }
  );
}
