export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  Mongo_URL:process.env.MONGO_URL,
  localhost:parseInt(process.env.LOCAL_HOST)
});
