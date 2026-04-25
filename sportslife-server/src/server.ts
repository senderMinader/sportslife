import { app } from './app';
import { connectToDatabase } from './config/db';
import { env } from './config/env';

const startServer = async (): Promise<void> => {
  try {
    await connectToDatabase();

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

void startServer();
