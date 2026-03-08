import type { CollectionEntry } from 'astro:content';

export function getPostDate(post: CollectionEntry<'blog'>): Date {
  return post.data.date;
}