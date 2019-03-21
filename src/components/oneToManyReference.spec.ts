import oneToManyReference from "./oneToManyReference";

describe("oneToManyReference", () => {
  it("can make a new component", () =>
    expect(oneToManyReference()).toBeDefined());

  describe("get and setter methods", () => {
    it("can add & get entites using methods", () => {
      const comp = oneToManyReference();
      comp.add(1, 2);
      expect(comp.get(1)).toContain(2);
    });

    it("returns undefined for non-existent entity", () => {
      const comp = oneToManyReference();
      comp.add(1, 2);
      expect(comp.get(2)).toBeUndefined();
    });

    it("can add references to an entity", () => {
      const comp = oneToManyReference();
      comp.add(1, 2);
      comp.set(1, 3);
      expect(comp.get(1)).toContain(2);
      expect(comp.get(1)).toContain(3);
    });

    it("can handle adding an existing entity twice", () => {
      const comp = oneToManyReference();
      comp.add(1, 2);
      comp.add(1, 3);
      expect(comp.get(1)).toContain(3);
    });

    it("will update the version on add", () => {
      const comp = oneToManyReference();
      comp.add(1, 2);
      expect(comp.version()).toBe(1);
      comp.add(1, 3);
      expect(comp.version()).toBe(2);
    });
  });

  describe("proxy functions", () => {
    it("can add and get entities using proxy", () => {
      const comp = oneToManyReference();
      comp[1] = 2;
      expect(comp[1]).toContain(2);
    });

    it("returns undefined for non-existent entity", () => {
      const comp = oneToManyReference();
      comp[1] = 2;
      expect(comp[2]).toBeUndefined();
    });

    it("can add a reference to an existing entity", () => {
      const comp = oneToManyReference();
      comp[1] = 2;
      comp[1] = 3;
      expect(comp[1]).toContain(2);
      expect(comp[1]).toContain(3);
    });

    it("can add multiple entities", () => {
      const comp = oneToManyReference();
      comp[1] = 2;
      comp[2] = 3;
      expect(comp[1]).toContain(2);
      expect(comp[2]).toContain(3);
    });

    it("will update the version of the component on update or add", () => {
      const comp = oneToManyReference();
      comp[1] = 2;
      expect(comp.version()).toBe(1);
    });
  });

  describe("clear", () => {
    it("can clear existing entity values", () => {
      const comp = oneToManyReference();
      comp[1] = 2;
      comp.clear();
      expect(comp[1]).not.toBeDefined();
    });

    it("clear will advance the version", () => {
      const comp = oneToManyReference();
      comp[1] = 2;
      comp.clear();
      expect(comp.version()).toBe(2);
    });
  });

  describe("remove", () => {
    it("can remove an entity", () => {
      const comp = oneToManyReference();
      comp[1] = 2;
      comp.remove(1);
      expect(comp[1]).toBeUndefined();
    });

    it("will handle removing a non-existent entity", () => {
      const comp = oneToManyReference();
      expect(() => comp.remove(1)).not.toThrow();
    });

    it("will not update version on removing non-existent entity", () => {
      const comp = oneToManyReference();
      comp.remove(1);
      expect(comp.version()).toBe(0);
    });

    it("will update the version on remove", () => {
      const comp = oneToManyReference();
      comp[1] = 2;
      comp.remove(1);
      expect(comp.version()).toBe(2);
    });

    it("will remove a relationship if allRefs and value is supplied", () => {
      const comp = oneToManyReference();
      comp.living({ 1: true, 2: true });
      comp[1] = 2;
      comp.remove(2, true);
      expect((comp[1] as Set<number>).size).toBe(0);
    });
  });

  describe("has", () => {
    it("returns true if entity has component", () => {
      const comp = oneToManyReference();
      comp[1] = 2;
      expect(comp.has(1)).toBe(true);
    });

    it("returns false if entity does not have component", () => {
      const comp = oneToManyReference();
      comp[1] = 2;
      expect(comp.has(2)).toBe(false);
    });
  });

  describe("forEach", () => {
    it("won't run for an empty component", () => {
      const spy = jest.fn();
      const comp = oneToManyReference();
      comp.forEach(spy);
      expect(spy).not.toHaveBeenCalled();
    });

    it("will call for each entity with componet", () => {
      const spy = jest.fn();
      const comp = oneToManyReference();
      comp.living({ 1: true, 2: true, 3: true, 4: true });
      comp[1] = 2;
      comp[2] = 3;
      comp[3] = 4;
      comp.forEach(spy);
      expect(spy).toHaveBeenCalledTimes(3);
    });
  });
});
