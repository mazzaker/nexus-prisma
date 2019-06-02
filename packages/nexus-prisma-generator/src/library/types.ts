import { core } from 'nexus'
import {
  GetGen,
  GetGen2,
  GetGen3,
  PrismaGenTypesShape,
  PrismaShapeKeys,
} from './typesHelpers'
import { GraphQLSchema } from 'graphql'
import { NexusPrismaGen } from './generated/types'

export type PrismaObjectTypeNames = Extract<
  keyof GetGen2<'objectTypes', 'fields'>,
  string
>

export type PrismaInputObjectTypeNames = Extract<
  keyof GetGen2<'inputTypes', 'fields'>,
  string
>

export type PrismaEnumTypeNames = Extract<
  keyof GetGen<'enumTypes', any>,
  string
>

export type PrismaEnumTypeValues<TypeName extends string> = GetGen2<
  'enumTypes',
  TypeName
>

export type ObjectTypeDetails<TypeName extends string> = GetGen3<
  'objectTypes',
  'fieldsDetails',
  TypeName
>

type InputField<
  GraphQLType extends PrismaShapeKeys,
  TypeName extends string
> = NexusPrismaGen extends infer GenTypes
  ? GenTypes extends PrismaGenTypesShape
    ? GraphQLType extends keyof GenTypes
      ? 'fields' extends infer Fields
        ? Fields extends keyof GenTypes[GraphQLType]
          ? TypeName extends keyof GenTypes[GraphQLType][Fields]
            ? GenTypes[GraphQLType][Fields][TypeName]
            : any
          : any
        : any
      : any
    : any
  : any

export type InputFieldsWithStar<
  GraphQLType extends PrismaShapeKeys,
  TypeName extends string
> = ('*' | InputField<GraphQLType, TypeName>)[]

export interface PickInputField<
  GraphQLType extends PrismaShapeKeys,
  TypeName extends string
> {
  pick: InputFieldsWithStar<GraphQLType, TypeName>
}

export interface FilterInputField<
  GraphQLType extends PrismaShapeKeys,
  TypeName extends string
> {
  filter:
    | ((fields: string[]) => string[])
    | InputFieldsWithStar<GraphQLType, TypeName>
}

export type AddFieldInput<
  GraphQLType extends PrismaShapeKeys,
  TypeName extends string
> =
  | InputFieldsWithStar<GraphQLType, TypeName>
  | PickInputField<GraphQLType, TypeName>
  | FilterInputField<GraphQLType, TypeName>

export type ObjectField = {
  name: string
  args?: string[] | false
  alias?: string
}
export type AnonymousField = '*' | string | ObjectField

export interface PrismaClient {
  $exists: any
  $graphql: <T = any>(
    query: string,
    variables?: { [key: string]: any },
  ) => Promise<T>

  [key: string]: any
}

export type PrismaClientInput =
  | string
  | ((ctx: core.GetGen<'context'>) => PrismaClient)

export interface DatamodelInfo {
  uniqueFieldsByModel: Record<string, string[]>
  embeddedTypes: string[]
  clientPath: string
  schema: { __schema: any }
}

export interface InternalDatamodelInfo
  extends core.Omit<DatamodelInfo, 'schema'> {
  schema: GraphQLSchema
}

export interface PrismaSchemaConfig extends core.BuilderConfig {
  types?: any
  photon?: PrismaClientInput
}

export interface InternalPrismaSchemaConfig
  extends core.Omit<PrismaSchemaConfig, 'photon'> {
  photon: PrismaClientInput
}
