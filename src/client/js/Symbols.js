/**
* This symbol is primarily used for extending objects without polluting the object's properties.
* This approach is especially useful in the context of inheritance.
* Since private fields are listed as stage-1 already, this can be removed once they are available.
*/
export const CUSTOM_EXTENSIONS = Symbol("[[Custom extensions]]");