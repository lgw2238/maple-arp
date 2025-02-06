import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { use } from "react";

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = context.params;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const character = await prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      return NextResponse.json(
        { error: "route | 캐릭터를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (character.userId !== session.user?.id) {
      return NextResponse.json(
        { error: "권한이 없습니다." },
        { status: 403 }
      );
    }

    await prisma.character.delete({
      where: { id },
    });

    return NextResponse.json({ message: "캐릭터가 삭제되었습니다." });
  } catch (error) {
    console.error("Error deleting character:", error);
    return NextResponse.json(
      { error: "캐릭터 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
