import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import firestore from "@/lib/firestore";
import { NextResponse } from "next/server";

export async function GET(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favoritesRef = firestore.collection('users').doc(session.user.id).collection('favorites');
    const snapshot = await favoritesRef.get();

    const favorites = snapshot.docs.map(doc => doc.id);

    return NextResponse.json(favorites);
}

export async function POST(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { seriesId } = await req.json();

    if (!seriesId) {
        return NextResponse.json({ error: "Missing seriesId" }, { status: 400 });
    }

    const favoriteRef = firestore.collection('users').doc(session.user.id).collection('favorites').doc(seriesId);
    const doc = await favoriteRef.get();

    if (doc.exists) {
        await favoriteRef.delete();
        return NextResponse.json({ action: "removed" });
    } else {
        await favoriteRef.set({
            seriesId,
            createdAt: new Date()
        });
        return NextResponse.json({ action: "added" });
    }
}
