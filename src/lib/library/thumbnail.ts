import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { ImageResponse } from 'next/og';
import { createElement as h } from 'react';

let assets: Promise<Buffer[]> | undefined;

/** Fixed PNG layout. These styles are consumed by the image renderer, not the UI. */
export async function renderLibraryThumbnail(name: string, username: string) {
  assets ??= Promise.all([
    readFile(path.join(process.cwd(), 'public/assets/library/library.png')),
    readFile(
      path.join(
        process.cwd(),
        'public/fonts/Source-Serif-4/static/SourceSerif4-Regular.ttf',
      ),
    ),
    readFile(
      path.join(
        process.cwd(),
        'public/fonts/NotoSansArmenian/NotoSansArmenian-Regular.ttf',
      ),
    ),
  ]).catch(error => {
    assets = undefined;
    throw error;
  });
  const [art, serif, armenian] = await assets;
  const image = new ImageResponse(
    h(
      'div',
      {
        style: {
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#f5f1ea',
          color: '#1c1c1a',
          fontFamily: 'Source Serif, Armenian',
        },
      },
      h(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            width: 720,
            padding: 48,
            justifyContent: 'center',
          },
        },
        h(
          'div',
          {
            style: {
              display: 'flex',
              fontSize: name.length > 20 ? 32 : 48,
              overflowWrap: 'anywhere',
              lineHeight: 1.2,
            },
          },
          `${name}'s`,
        ),
        h(
          'div',
          { style: { display: 'flex', fontSize: 76, marginBottom: 24 } },
          'Library',
        ),
        h(
          'div',
          {
            style: {
              display: 'flex',
              borderTop: '1px solid #ddd7ce',
              paddingTop: 24,
              fontSize: 32,
              color: '#5c5650',
            },
          },
          'Includes personal notes and precise recommendations.',
        ),
        h(
          'div',
          {
            style: {
              display: 'flex',
              marginTop: 48,
              fontSize: 24,
              overflowWrap: 'anywhere',
            },
          },
          `keepsimple.io/library/${username.toLowerCase()}`,
        ),
      ),
      h('img', {
        src: `data:image/png;base64,${art.toString('base64')}`,
        width: 480,
        height: 630,
        style: { objectFit: 'cover' },
      }),
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Source Serif', data: serif, weight: 400 },
        { name: 'Armenian', data: armenian, weight: 400 },
      ],
    },
  );
  return Buffer.from(await image.arrayBuffer());
}
