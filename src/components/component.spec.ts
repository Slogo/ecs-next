import Component from "./component";

describe("component", () => {
  it("can make a new component", () => expect(Component()).toBeDefined());

  describe("get and setter methods", () => {
    it("can add & get entites using methods", () => {
      const comp = Component();
      comp.add(1, "One");
      expect(comp.get(1)).toBe("One");
    });

    it("returns undefined for non-existent entity", () => {
      const comp = Component();
      comp.add(1, "One");
      expect(comp.get(2)).toBeUndefined();
    });

    it("can update an existing entity", () => {
      const comp = Component();
      comp.add(1, "One");
      comp.set(1, "Two");
      expect(comp.get(1)).toBe("Two");
    });

    it("can handle adding an existing entity twice", () => {
      const comp = Component();
      comp.add(1, "One");
      comp.add(1, "Two");
      expect(comp.get(1)).toBe("Two");
    });

    it("will update the version on add", () => {
      const comp = Component();
      comp.add(1, "One");
      expect(comp.version()).toBe(1);
      comp.add(1, "Two");
      expect(comp.version()).toBe(2);
    });

    it("add won't push new data for existing entiy", () => {
      const comp = Component();
      comp.add(1, "one");
      comp.add(1, "two");
      expect(comp.size()).toBe(1);
    });
  });

  describe("proxy functions", () => {
    it("can add and get entities using proxy", () => {
      const comp = Component();
      comp[1] = "One";
      expect(comp[1]).toBe("One");
    });

    it("returns undefined for non-existent entity", () => {
      const comp = Component();
      comp[1] = "One";
      expect(comp[2]).toBeUndefined();
    });

    it("can update an existing entity", () => {
      const comp = Component();
      comp[1] = "One";
      comp[1] = "Two";
      expect(comp[1]).toBe("Two");
    });

    it("can update an existing entity multiple times", () => {
      const comp = Component();
      comp[1] = "One";
      comp[1] = "Two";
      comp[1] = "Three";
      expect(comp[1]).toBe("Three");
    });

    it("can add multiple entities", () => {
      const comp = Component();
      comp[1] = "One";
      comp[2] = "Two";
      expect(comp[1]).toBe("One");
      expect(comp[2]).toBe("Two");
    });

    it("will update the version of the component on update or add", () => {
      const comp = Component();
      comp[1] = "One";
      expect(comp.version()).toBe(1);
    });

    it("won't push new data for existing entiy", () => {
      const comp = Component();
      comp[1] = "one";
      comp[1] = "two";
      expect(comp.size()).toBe(1);
    });
  });

  describe("clear", () => {
    it("can clear existing entity values", () => {
      const comp = Component();
      comp[1] = "One";
      comp.clear();
      expect(comp[1]).not.toBeDefined();
    });

    it("clear will advance the version", () => {
      const comp = Component();
      comp[1] = "One";
      comp.clear();
      expect(comp.version()).toBe(2);
    });
  });

  describe("remove", () => {
    it("can remove an entity", () => {
      const comp = Component();
      comp[1] = "One";
      comp.remove(1);
      expect(comp[1]).toBeUndefined();
    });

    it("can update indexes of other entities on remove", () => {
      const comp = Component();
      comp[1] = "One";
      comp[2] = "Two";
      comp[3] = "Three";
      comp.remove(2);
      expect(comp[3]).toBe("Three");
    });

    it("can remove an entity multiple times", () => {
      const comp = Component();
      comp[1] = "One";
      comp[2] = "Two";
      comp[3] = "Three";
      comp.remove(2);
      comp[2] = "Two-b";
      comp.remove(2);
      expect(comp[2]).toBeUndefined();
    });

    it("is removed even for iteration", () => {
      const comp = Component();
      comp.living({ 1: true, 2: true, 3: true });
      comp[1] = "One";
      comp[2] = "Two";
      comp[3] = "Three";
      comp.remove(2, true);
      comp[2] = "Two-B";
      comp.remove(2, true);

      expect(comp.map(v => v)).toMatchObject(["One", "Three"]);
    });

    it("will handle removing a non-existent entity", () => {
      const comp = Component();
      expect(() => comp.remove(1)).not.toThrow();
    });

    it("will not update version on removing non-existent entity", () => {
      const comp = Component();
      comp.remove(1);
      expect(comp.version()).toBe(0);
    });

    it("will update the version on remove", () => {
      const comp = Component();
      comp[1] = "One";
      comp.remove(1);
      expect(comp.version()).toBe(2);
    });
  });

  describe("has", () => {
    it("returns true if entity has component", () => {
      const comp = Component();
      comp[1] = "One";
      expect(comp.has(1)).toBe(true);
    });

    it("returns false if entity does not have component", () => {
      const comp = Component();
      comp[1] = "One";
      expect(comp.has(2)).toBe(false);
    });
  });

  describe("forEach", () => {
    it("won't run for an empty component", () => {
      const spy = jest.fn();
      const comp = Component();
      comp.forEach(spy);
      expect(spy).not.toHaveBeenCalled();
    });

    it("will call for each entity with componet", () => {
      const spy = jest.fn();
      const comp = Component();
      comp.living({ 1: true, 2: true, 3: true });
      comp[1] = "one";
      comp[2] = "two";
      comp[3] = "three";
      comp.forEach(spy);
      expect(spy).toHaveBeenCalledTimes(3);
    });
  });

  describe("map", () => {
    it("won't run for an empty component", () => {
      const spy = jest.fn();
      const comp = Component();
      comp.map(spy);
      expect(spy).not.toHaveBeenCalled();
    });

    it("will call for each entity with componet", () => {
      const spy = jest.fn();
      const comp = Component();
      comp.living({ 1: true, 2: true, 3: true });
      comp[1] = "one";
      comp[2] = "two";
      comp[3] = "three";
      comp.map(spy);
      expect(spy).toHaveBeenCalledTimes(3);
    });
  });

  describe("values", () => {
    it("will iterate over all the values", () => {
      const comp = Component<string>();
      comp[1] = "one";
      comp[2] = "two";
      comp[3] = "three";

      const valueOut: string[] = [];
      comp.values(v => valueOut.push(v));
      expect(valueOut).toEqual(["one", "two", "three"]);
    });
  });

  describe("updateValue", () => {
    it("will iterate over all the values", () => {
      const comp = Component<string>();
      comp[1] = "one";
      comp[2] = "two";
      comp[3] = "three";

      const valueOut: string[] = [];
      comp.updateValue(v => {
        valueOut.push(v);
        return `${v}-updated`;
      });
      expect(valueOut).toEqual(["one", "two", "three"]);
      expect(comp[1]).toBe("one-updated");
      expect(comp[2]).toBe("two-updated");
      expect(comp[3]).toBe("three-updated");
    });
  });
});
