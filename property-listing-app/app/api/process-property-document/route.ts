import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Here you would process the file and extract property information
    // For demonstration, we'll return mock data
    const mockData = {
      title: "Sample Property",
      description: "A beautiful property extracted from the uploaded document.",
      price: 500000,
      bedrooms: 3,
      bathrooms: 2,
      floor_size_sqm: 150
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error processing document:', error);
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    );
  }
}

async function getSession(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;

  const token = authHeader.split('Bearer ')[1];
  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error) return null;

  return data.user;
}

