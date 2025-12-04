import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import firestore from "@/lib/firestore";
import { NextResponse } from "next/server";

export async function GET(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const historyRef = firestore.collection('users').doc(session.user.id).collection('watchHistory');
    const snapshot = await historyRef.orderBy('lastWatchedAt', 'desc').limit(10).get();

    const history = snapshot.docs.map(doc => doc.data());

    return NextResponse.json(history);
}

export async function POST(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { seriesId, seriesTitle, seriesImage, episodeId, episodeTitle, position } = await req.json();

    // Create a unique ID for the history entry based on series and episode
    const docId = `${seriesId}_${episodeId}`;
    const historyRef = firestore.collection('users').doc(session.user.id).collection('watchHistory').doc(docId);

    const payload = {
        seriesId,
        seriesTitle,
        seriesImage,
        episodeId,
        episodeTitle,
        lastWatchedAt: new Date()
    };

    // If the client provided a playback position (in seconds), store it
    if (typeof position === 'number') {
        payload.lastPosition = position;
        payload.lastPositionAt = new Date();
    }

    await historyRef.set(payload, { merge: true });

    return NextResponse.json({ success: true });
}
