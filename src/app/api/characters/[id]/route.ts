import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const character = await prisma.character.findUnique({
      where: { id: params.id },
    });

    if (!character) {
      return NextResponse.json(
        { error: "캐릭터를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (character.userId !== session.user.id) {
      return NextResponse.json(
        { error: "권한이 없습니다." },
        { status: 403 }
      );
    }

    await prisma.character.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("캐릭터 등록 해제 중 오류:", error);
    return NextResponse.json(
      { error: "캐릭터 등록 해제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
