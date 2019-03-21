import Component from "./components/component";
import { EntitySystem } from "./ecs";

describe("Entity System", () => {
  it("can create an entity system", () => {
    expect(() => new EntitySystem({})).not.toThrow();
  });

  describe("entity", () => {
    let ecs: EntitySystem<any>;

    beforeEach(() => {
      ecs = new EntitySystem({});
    });

    it("can create an entity", () => {
      expect(ecs.entity.create()).toBeDefined();
    });

    it("will not use the same id twice in a row", () => {
      expect(ecs.entity.create()).not.toBe(ecs.entity.create());
    });

    it("isAlive is true for a new entity", () => {
      expect(ecs.isAlive(ecs.entity.create())).toBe(true);
    });

    it("isAlive is false for a destroyed entity", () => {
      const id = ecs.entity.create();
      ecs.entity.destroy(id);
      expect(ecs.isAlive(id)).toBe(false);
    });
  });

  describe("components", () => {
    let ecs: EntitySystem<any>;
    beforeEach(() => {
      ecs = new EntitySystem({});
    });

    it("won't return non-existent components", () => {
      expect(ecs.components.velocity).not.toBeDefined;
    });

    it("throws on setting component directly", () => {
      // @ts-ignore
      expect(() => (ecs.components.velocity = Component())).toThrow();
    });
  });

  describe("entity Proxy", () => {
    let ecs: EntitySystem<any>;
    let id: number;
    beforeEach(() => {
      ecs = new EntitySystem({ position: Component() });
      id = ecs.entity.create();
    });

    it("can create an entity proxy", () => {
      expect(ecs.entity.toProxy(id)).toBeDefined();
    });

    it("the proxy returns true if the entity has the component", () => {
      ecs.components.position[id] = 5;
      const proxy = ecs.entity.toProxy(id);
      expect(proxy.has("position")).toBe(true);
    });

    it("the proxy can get the value of a component", () => {
      ecs.components.position.add(id, 5);
      const proxy = ecs.entity.toProxy(id);
      expect(proxy.position).toBe(5);
    });

    it("the proxy can set the value of a component", () => {
      ecs.components.position.add(id, 5);
      const proxy = ecs.entity.toProxy(id);
      proxy.position = 10;
      expect(ecs.components.position[id]).toBe(10);
    });
  });

  describe("cleanup", () => {
    let ecs: EntitySystem<any>;

    beforeEach(() => {
      ecs = new EntitySystem({ position: Component() });
    });

    it("can run cleanup when nothing has died", () => {
      expect(() => ecs.cleanup()).not.toThrow();
    });

    it("will remove dead entities", () => {
      const id = ecs.entity.create();
      ecs.components.position[id] = 10;
      ecs.entity.destroy(id);
      ecs.cleanup();
      expect(ecs.components.position[id]).not.toBeDefined();
    });
  });
});
