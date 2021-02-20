/**
 * Font Description Interface
 * @interface
 */
export interface FontDescription {
  fav: boolean;
  hid: boolean;
  ltr: string;
  name: string;
  filename: string;
  md5: string;
  size: number;
};

/**
 * Full Font Description Interface
 * @interface
 */
export interface FontFull {
  _id: Id;
  letters?: (string)[] | null;
  fontName: string;
  charset?: (CharsetEntity)[] | null;
  paths: Paths;
  md5sum: string;
  color: boolean;
  symbol: boolean;
  decorative: boolean;
  scalable: boolean;
  outline: boolean;
  index: number;
  width: number;
  weight: number;
  slant: number;
  foundry: string;
  postscriptname: string;
  fontformat: string;
  fontversion: string;
  languages?: (string)[] | null;
  style: StyleOrFamilyOrFullname;
  family: StyleOrFamilyOrFullname;
  fullname: StyleOrFamilyOrFullname;
  size: number;
  modified: string;
  fileInfo: string;
  mimeType: string;
};

/**
 * Interface for the Id generated from Mongo
 * @interface
 */
export interface Id {
  $oid: string;
};

/**
 * Interface for a Character Set Entry
 * @interface
 */
export interface CharsetEntity {
  dec: number;
  hex: string;
  name: string;
};

/**
 * Interface for a Paths set
 * @interface
 */
export interface Paths {
  font: string;
  metadata: string;
  woff: string;
};

/**
 * Interface for style, family, or full name
 * @interface
 * @todo - This will need to get changed, probably will make these an array of objects
 */
export interface StyleOrFamilyOrFullname {
  English: string;
};
