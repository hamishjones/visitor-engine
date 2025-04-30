importScripts('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');

const supabase = supabase.createClient(
  'https://YOUR_PROJECT.supabase.co',
  'YOUR_ANON_KEY'
);

chrome.alarms.create('poll', { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener(async () => {
  const { data, error } = await supabase
    .from('invites')
    .select('*')
    .eq('status', 'queued')
    .order('created_at', { ascending: true })
    .limit(1);

  if (error || !data.length) return;

  // open a tab for the profile & pass invite data
  chrome.tabs.create(
    { url: data[0].profile_url },
    tab => chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (tabId === tab.id && info.status === 'complete') {
        chrome.tabs.sendMessage(tab.id, { invite: data[0] });
        chrome.tabs.onUpdated.removeListener(listener);
      }
    })
  );
});
