import { okResponse } from '../responses';

export async function GET() {
  return okResponse({ status: 'ok' });
}
