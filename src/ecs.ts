import { IComponentType } from "./components/component";
import { IMultiComponentType } from "./components/oneToManyReference";
import { ISingleReferenceType } from "./components/singleReference";

function* simpleID(initial: number = 1) {
  let id = initial;
  while (true) {
    yield id;
    id++;
  }
}

interface IComponentSetType {
  [key: string]:
    | IComponentType<any>
    | ISingleReferenceType<any>
    | IMultiComponentType<any>;
}

export class EntitySystem<T extends IComponentSetType> {
  entity: any;
  components: Readonly<T>;
  cleanup: () => void;

  private toKill: number[] = [];
  private living: { [key: number]: boolean } = {};

  constructor(componentSet: T) {
    if (!componentSet) {
      throw new Error("You must define your components upfront.");
    }

    for (const comp of Object.values(componentSet)) {
      comp.living(this.living);
    }
    const idGenerator = simpleID();
    this.components = new Proxy<T>(componentSet, {
      set: () => {
        throw new Error("Cannot set component directly");
      }
    });

    this.cleanup = () => {
      if (this.toKill.length) {
        Object.values(componentSet).forEach(component => {
          this.toKill.forEach(id => component.remove(id, true));
        });
      }
    };

    this.entity = {
      create: () => {
        const { value } = idGenerator.next();
        this.living[value] = true;
        return value;
      },
      destroy: (id: number) => {
        this.living[id] = false;
        this.toKill.push(id);
      },
      toProxy: (id: number) => {
        return new Proxy(
          {
            id,
            has: (name: string | number) => componentSet[name].has(id)
          },
          {
            get: (target: any, name: string | number) => {
              return target[name] || componentSet[name][id];
            },

            set: (_: any, name: string | number, value: any) => {
              componentSet[name][id] = value;
              return true;
            }
          }
        );
      }
    };
  }

  isAlive(id: number) {
    return this.living[id];
  }
}
