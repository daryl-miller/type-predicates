import fs from 'fs'

interface ConfigShape {
    name: string;
    version: string;
    settings: string;
}

function getConfigFile(): ConfigShape {
  const variableWithStringType = fs.readFileSync('./APath', 'utf-8')
  const variableWithAnyType = JSON.parse(variableWithStringType)

  return variableWithAnyType //This is still an any. So I have no type safety.
}

const isConfigShape = (rawConfig: unknown): rawConfig is ConfigShape => {
  //I could be a regex check.
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

  if (!isConfigShape(variableWithAnyType))
    throw new Error('Runtime check failed.') //Type is seen as any within this conditional scope

  console.log(variableWithAnyType.name) //I can now access properties

  return variableWithAnyType //Typescript sees I'm the correct type

}

async function main(): Promise<void> {
  const aFile = getConfigFile()
  const typeCheckedFile = getConfigFileWithPredicate()

  console.log(aFile)
  console.log(typeCheckedFile)
}

main()
