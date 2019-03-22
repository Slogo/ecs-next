# ecs-next
A modern ECS framework for javascript game development


## Usage

### Creating an EntitySystem

With `ecs-next` you define your components upfront when you create the initial entity system.

```javascript
import {EntitySystem, Component} from 'ecs-next';

const ecs = new EntitySystem({
  position: Component()
});

//Typescript can also be used
const ecs = new EntitySystem({
  position: Component<{x: number, y: number}>
 });
```

### Component types

`Component`: Simple Component that associates an entity with a piece of data. If the entity is destroyed the entry will be cleaned up. If you are using typescript you can provide a type: `Component<number>` to enforce the data type of the component.

`SingleReferenceComponent`: Component that defines a one to one parent child relationship between an entity. Each entity can have one child, and be the child of only one parent, but may be both a parent and a child. If either entity is destroyed the association is removed.


### Entity lifecycle

```javascript
//Creating an entity
const id = ecs.entity.create(); // Returns the id of the newly created entity

//Destroy an entity
ecs.entity.destroy(id); // Destroys the entity, but does not remove the entity completely.

//Cleanup
ecs.entity.cleanup(id); // Will iterate over all components and remove the data for dead entities. Typically you can call this at the end of a frame to clear dead entities completely.
```

### Using Components

`ecs-next` take advantage of object proxies to present an array-like interface to the components. If you don't like this syntax a `get` and `set` function are also available to use.

```javascript
//Accessing values
ecs.position[entityId] = {x: 1, y: 1}; // Sets the position for the entityId
ecs.position[entityId] // Gets the position for the entityId

//Removing a component
ecs.position.remove(entityId); // Removes the component from the entity

//Checking for existance
ecs.position.has(entityId); // true/false based on whether entity has a value (even a falsey one) for the component

//Iteration
ecs.position.forEach((value, id) => {...}) // Iterates over all (living) entities that have this component and invokes the callback with their current value and the entity id
```



