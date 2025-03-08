import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const usersWithSubscriptions = await prisma.user.findMany({
        include: {
            subscriptions: {
              include: {
                plan: true
              },
            }
        },
    });

    return NextResponse.json(
      {
        success: {
          message: "Fetch data successfully!"
        },
        data: usersWithSubscriptions,
      },
      {
        status: 200,
        statusText: 'OK'
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: 'An unexpected error occurred. \n' + error
        }
      },
      {
        status: 500,
        statusText: 'Internal Server Error'
      }
    );
  }
}