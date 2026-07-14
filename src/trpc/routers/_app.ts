import { agentsRouter } from '@/modules/agents/server/procedures';
import { premiumRouter } from '@/modules/premium/server/procedures';
import { meetingsRouter } from '@/modules/meetings/server/procedures';
import { notificationsRouter } from '@/modules/notifications/server/procedures';
import { searchRouter } from '@/modules/search/server/procedures';

import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingsRouter,
  premium: premiumRouter,
  notifications: notificationsRouter,
  search: searchRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
