import { NextResponse } from 'next/server';

export const notFoundResponse = (message: string = 'Resource not found') =>
  new NextResponse(JSON.stringify({ message }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const badRequestResponse = (message: string = 'Bad request') =>
  new NextResponse(JSON.stringify({ message }), {
    status: 400,
    headers: {
      'Content-Type': 'application/json',
    },
  });
