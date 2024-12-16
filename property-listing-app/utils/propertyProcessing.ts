import { Session } from "@supabase/supabase-js";

export async function processPropertyDocument(formData: FormData, session: Session) {
  const response = await fetch('/api/process-property-document', {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${session.access_token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to process document');
  }

  return await response.json();
}

export async function processPropertyAudio(formData: FormData, session: Session) {
  const response = await fetch('/api/process-property-audio', {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${session.access_token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to process audio');
  }

  return await response.json();
}

