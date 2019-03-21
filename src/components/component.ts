export interface IComponentType<T> {
  version: () => number;
  living: (value: { [key: number]: boolean }) => void;
  size: () => number;
  add: (id: number, value: any) => void;
  remove: (id: number, allRefs?: boolean) => void;
  clear: () => void;
  has: (id: number) => boolean;
  get: (id: number) => T | undefined;
  set: (id: number, value: T) => void;
  forEach: (callback: (value: T, id: number) => void) => void;
  map: <I extends {}>(callback: (value: T, id: number) => I) => I[];
  updateValue: (callback: (value: T) => T) => void;
  values: (callback: (value: T) => void) => void;
  [key: number]: T;
}

export default function Component<T>(): IComponentType<T> {
  let living: { [key: number]: boolean } = {};
  let entityToIndex: Array<number | null> = [];
  let indexToEntity: number[] = [];
  let data: T[] = [];

  let version = 0;
  return new Proxy(
    {
      living: (value: { [key: number]: boolean }) => (living = value),
      version: () => version,
      size: () => data.length,
      clear: () => {
        entityToIndex = [];
        indexToEntity = [];
        data = [];
        version += 1;
      },

      add: (id: number, value: any) => {
        version += 1;
        if (entityToIndex[id] != null) {
          data[entityToIndex[id] as number] = value;
        } else {
          entityToIndex[id] = data.length;
          indexToEntity[data.length] = id;
          data.push(value);
        }
      },

      remove: (id: number) => {
        const index = entityToIndex[id];
        if (index === data.length - 1) {
          version += 1;
          data.pop();
          indexToEntity.pop();
          entityToIndex[id] = null;
        } else if (index != null) {
          version += 1;
          const moved = indexToEntity[data.length - 1];
          entityToIndex[moved] = index;
          data[index] = data.pop() as T;
          indexToEntity[index] = moved;
          indexToEntity.pop();
          entityToIndex[id] = null;
        }
      },

      has: (id: number) => entityToIndex[id] != null,
      get: (id: number) =>
        (entityToIndex[id] != null || void 0) &&
        data[entityToIndex[id] as number],
      set: (id: number, value: T) => {
        version += 1;
        return (
          entityToIndex[id] != null &&
          (data[entityToIndex[id] as number] = value)
        );
      },
      forEach: (callback: (value: T, id: number) => void) => {
        let id;
        data.forEach((value, index) => {
          id = indexToEntity[index];
          return living[id] && callback(value, id);
        });
      },

      map: (callback: (value: T, id: number) => any) => {
        let id;
        return data.map((value, index) => {
          id = indexToEntity[index];
          return living[id] && callback(value, id);
        });
      },
      values: (callback: (value: T) => any) => {
        for (const v of data) {
          callback(v);
        }
      },
      updateValue: (callback: (value: T) => T) => {
        for (let i = 0; i < data.length; i++) {
          data[i] = callback(data[i]);
        }
      }
    },
    {
      get: (target: any, name: number) => {
        return (
          target[name] ||
          ((entityToIndex[name] != null || void 0) &&
            data[entityToIndex[name] as number])
        );
      },

      set: (_: any, name: number, value: T) => {
        version += 1;
        if (entityToIndex[name] != null) {
          data[entityToIndex[name] as number] = value;
        } else {
          entityToIndex[name] = data.length;
          indexToEntity[data.length] = name;
          data.push(value);
        }
        return true;
      }
    }
  );
}
