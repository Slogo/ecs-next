import SingleReference from "./singleReference";

describe("singleReference", () => {
  it("can make a new component", () => expect(SingleReference()).toBeDefined());

  describe("get and setter methods", () => {
    it("can add & get entites using methods", () => {
      const comp = SingleReference();
      comp.add(1, 2);
      expect(comp.get(1)).toBe(2);
    });

    it("returns undefined for non-existent entity", () => {
      const comp = SingleReference();
      comp.add(1, 2);
      expect(comp.get(2)).toBeUndefined();
    });

    it("can update an existing entity", () => {
      const comp = SingleReference();
      comp.add(1, 2);
      comp.set(1, 3);
      expect(comp.get(1)).toBe(3);
    });

    it("can handle adding an existing entity twice", () => {
      const comp = SingleReference();
      comp.add(1, 2);
      comp.add(1, 3);
      expect(comp.get(1)).toBe(3);
    });

    it("will update the version on add", () => {
      const comp = SingleReference();
      comp.add(1, 2);
      expect(comp.version()).toBe(1);
      comp.add(1, 3);
      expect(comp.version()).toBe(2);
    });

    it("can update an existing entity multiple times", () => {
      const comp = SingleReference();
      comp.add(1, 2);
      comp.add(1, 3);
      comp.add(1, 2);
      expect(comp.get(1)).toBe(2);
    });
  });

  describe("proxy functions", () => {
    it("can add and get entities using proxy", () => {
      const comp = SingleReference();
      comp[1] = 2;
      expect(comp[1]).toBe(2);
    });

    it("returns undefined for non-existent entity", () => {
      const comp = SingleReference();
      comp[1] = 2;
      expect(comp[2]).toBeUndefined();
    });

    it("can update an existing entity", () => {
      const comp = SingleReference();
      comp[1] = 2;
      comp[1] = 3;
      expect(comp[1]).toBe(3);
    });

    it("can update an existing entity multiple times", () => {
      const comp = SingleReference();
      comp[1] = 2;
      comp[1] = 3;
      comp[1] = 2;
      expect(comp[1]).toBe(2);
    });

    it("can add multiple entities", () => {
      const comp = SingleReference();
      comp[1] = 2;
      comp[2] = 3;
      expect(comp[1]).toBe(2);
      expect(comp[2]).toBe(3);
    });

    it("will update the version of the component on update or add", () => {
      const comp = SingleReference();
      comp[1] = 2;
      expect(comp.version()).toBe(1);
    });
  });

  describe("clear", () => {
    it("can clear existing entity values", () => {
      const comp = SingleReference();
      comp[1] = 2;
      comp.clear();
      expect(comp[1]).not.toBeDefined();
    });

    it("clear will advance the version", () => {
      const comp = SingleReference();
      comp[1] = 2;
      comp.clear();
      expect(comp.version()).toBe(2);
    });
  });

  describe("remove", () => {
    it("can remove an entity", () => {
      const comp = SingleReference();
      comp[1] = 2;
      comp.remove(1);
      expect(comp[1]).toBeUndefined();
    });

    it("will handle removing a non-existent entity", () => {
      const comp = SingleReference();
      expect(() => comp.remove(1)).not.toThrow();
    });

    it("can update indexes of other entities on remove", () => {
      const comp = SingleReference();
      comp[1] = 11;
      comp[2] = 12;
      comp[3] = 13;
      comp.remove(2);
      expect(comp[3]).toBe(13);
    });

    it("can remove an entity multiple times", () => {
      const comp = SingleReference();
      comp.living({
        1: true,
        2: true,
        3: true,
        11: true,
        12: true,
        13: true,
        14: true
      });
      comp[1] = 11;
      comp[2] = 12;
      comp[3] = 13;
      comp.remove(2);
      comp[2] = 14;
      comp.remove(2);
      expect(comp[2]).toBeUndefined();
    });

    it("is removed even for iteration", () => {
      const comp = SingleReference();
      comp.living({
        1: true,
        2: true,
        3: true,
        11: true,
        12: true,
        13: true,
        14: true
      });
      comp[1] = 11;
      comp[2] = 12;
      comp[3] = 13;
      comp.remove(2);
      comp[2] = 14;
      comp.remove(2);

      expect(comp.map(v => v)).toMatchObject([11, 13]);
    });

    it("will not update version on removing non-existent entity", () => {
      const comp = SingleReference();
      comp.remove(1);
      expect(comp.version()).toBe(0);
    });

    it("will update the version on remove", () => {
      const comp = SingleReference();
      comp[1] = 2;
      comp.remove(1);
      expect(comp.version()).toBe(2);
    });

    it("will remove a relationship if allRefs and value is supplied", () => {
      const comp = SingleReference();
      comp.living({ 1: true, 2: true });
      comp[1] = 2;
      comp.remove(2, true);
      expect(comp[1]).toBeUndefined();
    });
  });

  describe("has", () => {
    it("returns true if entity has component", () => {
      const comp = SingleReference();
      comp[1] = 2;
      expect(comp.has(1)).toBe(true);
    });

    it("returns false if entity does not have component", () => {
      const comp = SingleReference();
      comp[1] = 2;
      expect(comp.has(2)).toBe(false);
    });
  });

  describe("forEach", () => {
    it("won't run for an empty component", () => {
      const spy = jest.fn();
      const comp = SingleReference();
      comp.forEach(spy);
      expect(spy).not.toHaveBeenCalled();
    });

    it("will call for each entity with componet", () => {
      const spy = jest.fn();
      const comp = SingleReference();
      comp.living({ 1: true, 2: true, 3: true, 4: true });
      comp[1] = 2;
      comp[2] = 3;
      comp[3] = 4;
      comp.forEach(spy);
      expect(spy).toHaveBeenCalledTimes(3);
    });
  });

  describe("map", () => {
    it("won't run for an empty component", () => {
      const spy = jest.fn();
      const comp = SingleReference();
      comp.map(spy);
      expect(spy).not.toHaveBeenCalled();
    });

    it("will call for each entity with componet", () => {
      const spy = jest.fn();
      const comp = SingleReference();
      comp.living({ 1: true, 2: true, 3: true, 4: true });
      comp[1] = 2;
      comp[2] = 3;
      comp[3] = 4;
      comp.map(spy);
      expect(spy).toHaveBeenCalledTimes(3);
    });
  });

  describe("values", () => {
    it("will iterate over all the values", () => {
      const comp = SingleReference();
      comp.living({ 1: true, 2: true, 3: true, 4: true });
      comp[1] = 2;
      comp[2] = 3;
      comp[3] = 4;

      const valueOut: number[] = [];
      comp.values(v => valueOut.push(v));
      expect(valueOut).toEqual([2, 3, 4]);
    });
  });
});
