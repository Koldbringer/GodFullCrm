import type { MDXComponents } from 'mdx/types';
import { Alert } from './Alert';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    Alert,
    ...components,
  };
}
