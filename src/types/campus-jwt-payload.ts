import { JwtPayload } from 'jsonwebtoken';

export interface CampusJwtPayload extends JwtPayload {
  modules: string[];
}
