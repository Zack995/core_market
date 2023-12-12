import { CorsBalanceInitService } from '@/service/cors_balance_init';

export default router => {
  router.get('/init_Transaction', async ctx => {
    try {
      const corsBalanceInitService = new CorsBalanceInitService();
      corsBalanceInitService.runInitTransaction();
      ctx.body = 'success';
    } catch (error) {
      ctx.body = error.message;
    }
  });
  router.get('/init_Balance', async ctx => {
    try {
      const corsBalanceInitService = new CorsBalanceInitService();
      corsBalanceInitService.runInitBalance();
      ctx.body = 'success';
    } catch (error) {
      ctx.body = error.message;
    }
  });
};
