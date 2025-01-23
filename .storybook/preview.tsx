import '../src/app/[locale]/globals.css';

import type { Preview } from '@storybook/react';
import React from 'react';
import { exo2Font } from '../src/app/font';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <main className={`${exo2Font.className}`}>
        <Story />
      </main>
    ),
  ],
};

export default preview;
