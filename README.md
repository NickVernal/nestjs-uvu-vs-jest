# NestJS uvu vs jest

## Motivation

I was interested if it is possible to use <ins>uvu</ins> instead of <ins>jest</ins> inside of a typical NestJS project, considering different e2e testing scenarios

## Results
- <ins>uvu</ins> is 10% faster on average than <ins>jest</ins>
- node_modules are 45mb lighter with <ins>uvu</ins>
- <ins>uvu</ins> lacks nested `describe`
- <ins>uvu</ins> lacks `toMatchObject`, which is pretty easy to implement
- <ins>uvu</ins> lacks `toMatchSnapshot`, which is pretty hard to implement with such automatic snapshot manipulation features
- it's possible to create a look alike test syntax between libraries with wrapper functions

## Conclusion
If you don't rely on <ins>jest</ins>'s `toMatchSnapshot`, it's totally possible to use <ins>uvu</ins> instead

## Places for improvement
- `toMatchObject` implementation
- `toMatchSnapshot` implementation
- `yarn uvu:e2e` command
-  database drop `package.json` script 
- config.ts autofill
- config.ts env validation
