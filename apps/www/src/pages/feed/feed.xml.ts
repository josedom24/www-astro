import rss from '@astrojs/rss';
import { getCollection, render } from 'astro:content';
import { marked } from 'marked';
import type { APIContext } from 'astro';
import { getPostDate } from '@pledin/ui/utils/date';
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

function getFirstCommitDate(filePath: string): Date | null {
  try {
    const out = execSync(
      'git log --diff-filter=A --follow --format=%aI -- ' + JSON.stringify(filePath),
      { encoding: 'utf8' },
    ).trim();
    const lines = out.split('\n').filter(Boolean);
    if (lines.length === 0) return null;
    const iso = lines[lines.length - 1];
    const d = new Date(iso);
    return Number.isNaN(d.valueOf()) ? null : d;
  } catch {
    return null;
  }
}

function resolveContentFile(base: string, id: string): string | null {
  for (const ext of ['.md', '.mdx']) {
    const p = path.resolve(base, id + ext);
    if (existsSync(p)) return p;
  }
  return null;
}

function getPubDate(base: string, id: string, fallback: Date): Date {
  const file = resolveContentFile(base, id);
  if (!file) return fallback;
  return getFirstCommitDate(file) ?? fallback;
}

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog'))
    .sort((a, b) => getPostDate(b).valueOf() - getPostDate(a).valueOf());

  const microposts = (await getCollection('microblog'))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const blogItems = posts.map(post => {
    const slug = post.data.slug ?? post.id;
    const url = `${context.site}${slug.replace(/^blog\//, '')}/`;
    const html = (marked(post.body ?? '') as string)
      .replace(/src="\/pledin\//g, `src="https://www.josedomingo.org/pledin/`);
    return {
      title: post.data.title,
      pubDate: getPubDate('src/content/blog', post.id, getPostDate(post)),
      description: post.data.excerpt ?? '',
      content: html,
      link: url,
      categories: ['blog'],
    };
  });

  const microItems = await Promise.all(microposts.map(async post => {
    const match = post.id.match(/^(\d{4})-(\d{2})-\d{2}-(.+)$/);
    const url = match
      ? `${context.site}microblog/${match[1]}/${match[2]}/${match[3]}/`
      : `${context.site}microblog/${post.id}/`;
    const { Content } = await render(post);
    const html = (marked(post.body ?? '') as string)
      .replace(/src="\/pledin\//g, `src="https://www.josedomingo.org/pledin/`);
    return {
      title: post.data.title,
      pubDate: getPubDate('src/content/microblog', post.id, post.data.date),
      description: '',
      content: html,
      link: url,
      categories: ['microblog'],
    };
  }));

  const items = [...blogItems, ...microItems]
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()).slice(0, 20);

  return rss({
    title: 'Blog de Pledin',
    description: 'Blog personal de José Domingo Muñoz',
    site: context.site!,
    trailingSlash: true,
    items,
  });
}
