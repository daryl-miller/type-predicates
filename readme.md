# Type-predicates

## Overview

Typescript only performs compile time checks on types. What this means is if a function call at runtime returns an unexpected result the program may not fail straight away, or at all leading to unexpected behaviour. Type predicates are a tool to perform runtime checks on types and informs the typescript compiler whether my unknown/any type is what I expect it to be. 

### Example

Consider that you have some files that store data you would like to persist in the database.

```javascript

interface ConfigShape {
    name: string;
    version: string;
    settings: string;
}

function getConfigFile(): ConfigShape {
  const variableWithStringType = fs.readFileSync('./APath', 'utf-8') //Type is string
  const variableWithAnyType = JSON.parse(variableWithStringType) //Type is any

  return variableWithAnyType //Type is still any. Typescript implicitly assumes this any type matches the ConfigShape interface.
}
```

This is dangerous because any code that relies on this function assumes that returned object is a 'ConfigShape' type. This can lead to circumstances where I store data that is in the wrong format, or I have a failure downstream because I expect the name property to be available.


### Solution

The below solution implements a type predicate to check the JSON parsed result. If it's not we throw an error / "handle it. If it does pass the type predicate check we can now access the properties attached to the object as Typescript now infers the type as 'ConfigShape' not 'any'.

```javascript
interface ConfigShape {
    name: string;
    version: string;
    settings: string;
}

const isConfigShape = (rawConfig: unknown): rawConfig is ConfigShape => { //Type predicates always return true or false.

  if (typeof (rawConfig as ConfigShape).name !== 'string')
    return false

  if (typeof (rawConfig as ConfigShape).version !== 'string')
    return false

  if (typeof (rawConfig as ConfigShape).settings !== 'string')
    return false

  return true
}

function getConfigFileWithPredicate(): ConfigShape {

  const variableWithStringType = fs.readFileSync('./APath', 'utf-8')
  const variableWithAnyType = JSON.parse(variableWithStringType)

  if (!isConfigShape(variableWithAnyType)) {
    throw new Error('Runtime check failed.') //Type is seen as any within this conditional scope
  }

  console.log(variableWithAnyType.name) //We can now access properties

  return variableWithAnyType //Typescript sees I'm the correct type

}

```

### When should I/Shouldn't I use Type predicates.

I recommend using type predicates whenever you pull in data from a source you cannot trust/has uncertainty. E.g. parsing user input, or loading a file. 

They shouldn't be used as stand ins for validators/validation. They don't provide enough context when they return (a boolean) to know why something doesn't match the expected shape. Due to this, I recommend keeping your type predicates simple e.g. this field is a string, or doing a simple regex check on a guid. Your complex validation logic should live separately.

In summation 
- type predicates => Matches shape
- validation => Matches business rules