declare module '*.less' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.md' {
  const content: string;
  export default content;
}

declare module '*.mdx' {
  const content: string;
  export default content;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
