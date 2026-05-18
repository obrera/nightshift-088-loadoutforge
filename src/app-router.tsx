import { createBrowserRouter, Navigate } from 'react-router'

import type { ShellNotFoundProps } from '@/shell/data-access/shell-not-found-props'

import { ShellFeature, ShellUiLoader } from '@/shell/feature'

export const appRouter = createBrowserRouter(
  [
    {
      children: [
        { element: <Navigate replace to="/forge" />, index: true },
        {
          lazy: () => import('@/loadoutforge/feature/loadoutforge-feature'),
          path: 'forge',
        },
        {
          lazy: () => import('@/about/feature/about-feature'),
          path: 'about',
        },
        {
          lazy: () => import('@/wallet/feature/wallet-feature'),
          path: 'wallet',
        },
        {
          lazy: () => import('@/shell/feature/shell-not-found-feature'),
          loader: (): ShellNotFoundProps => ({
            links: [
              {
                description: 'Learn what this starter includes and how the wallet playground is organized.',
                title: 'About',
                to: '/about',
              },
              {
                description: 'Open the playable character loadout forge.',
                title: 'LoadoutForge',
                to: '/forge',
              },
            ],
          }),
          path: '*',
        },
      ],
      element: (
        <ShellFeature
          links={[
            { label: 'Forge', to: '/forge' },
            { label: 'About', to: '/about' },
          ]}
        />
      ),
      hydrateFallbackElement: <ShellUiLoader fullScreen />,
    },
  ],
  {
    // Set the base URL for router links and redirects, removing trailing slashes if present, independent of the base
    basename: import.meta.env.BASE_URL === '/' ? '/' : import.meta.env.BASE_URL.replace(/\/$/, ''),
  },
)
