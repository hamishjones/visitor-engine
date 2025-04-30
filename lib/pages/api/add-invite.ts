import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { return res.status(405).end(); }

  const { member_id, profile_url, first_name, note } = req.body;
  const { error } = await supabase.from('invites').insert({
    member_id, profile_url, first_name, note, status: 'queued'
  });

  if (error) return res.status(500).json({ error });
  res.status(200).json({ ok: true });
}
