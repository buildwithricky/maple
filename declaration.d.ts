// declarations.d.ts

// Image file types
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.gif';
declare module '*.svg';

// Font file types (if needed)
declare module '*.ttf';
declare module '*.otf';

// Other custom types or declarations can go here
declare module '@env' {
    export const API_URl: string;
    // Add other environment variables here
  }