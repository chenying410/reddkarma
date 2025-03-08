
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req) {

  const { planId } = await req.json();
  
  try {

    const plan = await prisma.plan.findUnique({
      where: {
        id: parseInt(planId), 
      },
    });
    
    return NextResponse.json(
      {
        success: {
          message: "Fetch data successfully!"
        },
        data: plan,
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

export async function GET(req) {
  const plan = await prisma.plan.findMany({
    orderBy: {
      id: 'asc',
    }
  });
  try {
    const plans = await prisma.plan.findMany({
      orderBy: {
        id: 'asc',
      }
    });

    return NextResponse.json(
      {
        success: {
          message: "Fetch data successfully!"
        },
        data: plans,
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
