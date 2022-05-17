import type Generators from '../generators';
import { Get, Split } from 'type-fest';

type GeneratorsType = typeof Generators;

/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/ban-ts-comment */
type FunctionObject = { [key: string]: FunctionObject | Function };
type FunctionChildren<Parent> = {
  [Key in keyof Parent]: Parent[Key] extends Function
    ? Key
    : Key extends string
    ? Parent[Key] extends FunctionObject
      ? FunctionChildren<Parent[Key]>[keyof FunctionChildren<
          Parent[Key]
        >] extends string
        ? // @ts-ignore
          `${Key}.${FunctionChildren<Parent[Key]>[keyof FunctionChildren<
            Parent[Key]
          >]}`
        : never
      : never
    : never;
};
/* eslint-enable @typescript-eslint/ban-types, @typescript-eslint/ban-ts-comment */

type FunctionStringObject = FunctionChildren<GeneratorsType>;
type FunctionStringUnion = FunctionStringObject[keyof FunctionStringObject];
export type FunctionStringUnionWithoutPermutations = Exclude<
  FunctionStringUnion,
  'GenerateAllPermutations' | `GenerateAllPermutations.${any}`
>;

type Run = {
  [key in FunctionStringUnion]: {
    function: key;
    parameters: Parameters<Get<GeneratorsType, Split<key, '.'>>>;
    disabled: boolean;
  };
}[FunctionStringUnion];

export type Configuration = {
  $schema: string;
  options: {
    exportErrors: boolean;
  };
  runs: Run[];
};
