# Milvus.io Official website

## Init Submodule

```bash
git submodule init

git submodule update --remote
```

## Install Dependency

```bash
pnpm install
```

## Generate .env.development file

```
cp .env.production .env.development
```

## Run the development server

```bash
pnpm run dev
```

## Add shadcn ui components

```
npx shadcn-ui@latest add {component-name}
```

## How to contribute

1. fork the repo
2. checkout the preview branch
3. create a new feature branch based on the preview branch
4. pull request to the preview branch

## Learn More

- [Next.js](https://nextjs.org/)
- [Tailwindcss](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com/docs/components)
