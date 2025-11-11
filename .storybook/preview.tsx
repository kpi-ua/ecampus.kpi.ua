import '../src/app/[locale]/globals.css';

import type { Preview } from '@storybook/react';
import { interFont } from '../src/app/font';

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
      <main className={`${interFont.className}`}>
        <Story />
      </main>
    ),
  ],
};

export default preview;
