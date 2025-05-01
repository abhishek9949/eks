import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get('url');

    if (!fileUrl) {
        return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    try {
        const response = await fetch(fileUrl);

        if (!response.ok) {
            console.error(`Fetch failed: ${response.statusText}`);
            return NextResponse.json(
                { error: `Failed to fetch the file. Status: ${response.status}` },
                { status: response.status }
            );
        }

        const contentType = response.headers.get('content-type') ?? 'application/pdf';

        return new Response(response.body, {
            headers: {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
