/*

Create Express + Typescript Back-end

1. create folder

mdkir folder-name

2. cs folder-name

3. npm init --y

4. npm i typescript ts-node ts-node-dev @types/node @types/cors -D

-D artinya masuk ke devDependencies = hanya diperlukan pada development, tidak diperlokan pada deployment

5. npm i express cors 

6. tsc --init

7. ts.conig.json = line 60 =  "outDir": "./dist" 

8. create .gitignore = node_modules, package-lock.json, dist, .env

9. package.json:

    "build": "tsc",
    "start": "npm run build && node dist/index.js",
    "dev": "ts-node-dev src/index.ts",

*/