export default (router) => {
  router.get("/rm_lock", async (ctx) => {
    try {
      console.info("keys");
      ctx.body = "success";
    } catch (error) {
      ctx.body = error.message;
    }
  });
};
