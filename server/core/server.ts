import express, { Express } from 'express';
import { Framework } from './framework';

class Server {
  private app: Express;

  constructor() {
    this.app = express();
    this.setupMiddleware();
  }

  // Setup core middleware like bodyParser, CORS, etc.
  private setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  // Method to load modules dynamically
  public loadModules(modules: string[]) {
    modules.forEach(module => {
      const mod = require(`../modules/${module}`);
      mod.routes(this.app);
    });
  }

  // Method to start the server
  public start(port: number = 3000) {
    this.app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }
}

export default Server;
