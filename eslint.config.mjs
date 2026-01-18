import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier/flat';

const config = [...nextCoreWebVitals, ...nextTypeScript, prettierConfig];

export default config;
