// Next Imports
import { NextResponse } from 'next/server'

// Mock data for demo purpose
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

require('dotenv').config();

export async function POST(req) {
  // Vars
  const { fullName, userName, email, password, telegram } = await req.json()

console.log(process.env.DATABASE_URL)

  console.log(email, prisma.user.findUnique)

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    }
  })

  if (user) {
    return NextResponse.json(
      {
        error: {
          email: {
            message: 'Email already exists'
          }
        }
      },
      {
        status: 400,
        statusText: "Bad Request",
      });
  }
  else {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newCreatedUser = await prisma.user.create({
        data: {
          name: userName,
          userName: userName,
          fullName: fullName,
          email: email,
          password: hashedPassword,
          telegram: telegram,
        }
      });

      if (!newCreatedUser) {
        return NextResponse.json(
          {
            error: {
              message: 'Internal Server Error'
            }
          },
          {
            status: 500,
            statusText: "Internal Server Error",
          });
      }
      else {
        return NextResponse.json(
          {
            success: {
              message: 'Registration Successfully!'
            }
          },
          {
            status: 200,
            statusText: "OK",
          });
      }
    } catch (error) {
      return NextResponse.json(
        {
          error: {
            message: 'Register Failed: ' + error
          }
        },
        {
          status: 400,
          statusText: "Bad Request"
        }
      );
    }
  }
}
