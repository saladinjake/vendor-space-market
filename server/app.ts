import Server from './core/server';
import { logger } from './middlewares/logger.middleware';
import workspaceRoutes from "./core/routes/vendorSpace.routes"
const app: any = new Server();
// Use global middleware
app.use(logger);
// Use routes
app.use('/api/vendor', workspaceRoutes);
// Load your modules dynamically
app.loadModules([
    'user', 
    'product'
]);
// Start the server
app.start(3000);
