import { Router } from 'express';

import { loginController } from './auth.controller';

export const authRoutes = Router();

// Endpoint pour la connexion des utilisateurs avec email et password, retourne un token JWT en cas de succès
authRoutes.post('/login', loginController);
