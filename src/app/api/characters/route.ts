import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const { characterName } = await request.json();

    if (!characterName) {
      return NextResponse.json(
        { error: "캐릭터 이름은 필수입니다." },
        { status: 400 }
      );
    }

    // 이미 등록된 캐릭터인지 확인
    const existingCharacter = await prisma.character.findUnique({
      where: { name: characterName },
    });

    if (existingCharacter) {
      return NextResponse.json(
        { error: "이미 등록된 캐릭터입니다." },
        { status: 400 }
      );
    }

    // 캐릭터 등록
    const character = await prisma.character.create({
      data: {
        name: characterName,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ character });
  } catch (error) {
    console.error("캐릭터 등록 에러:", error);
    return NextResponse.json(
      { error: "캐릭터 등록 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // 사용자의 등록된 캐릭터 목록 조회
    const characters = await prisma.character.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ characters });
  } catch (error) {
    console.error("캐릭터 조회 에러:", error);
    return NextResponse.json(
      { error: "캐릭터 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
