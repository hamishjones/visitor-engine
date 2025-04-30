chrome.runtime.onMessage.addListener(({ invite }) => {
  if (!invite) return;

  // Wait a bit for page to settle
  setTimeout(() => {
    // 1. Click “Connect”
    const connectBtn = document.querySelector('button[aria-label*="Connect"]');
    if (!connectBtn) return;
    connectBtn.click();

    // 2. Add note
    setTimeout(() => {
      const addNoteBtn = document.querySelector('button[aria-label="Add a note"]');
      if (!addNoteBtn) return;
      addNoteBtn.click();

      setTimeout(() => {
        const textarea = document.querySelector('textarea[name="message"]');
        if (!textarea) return;
        textarea.value = invite.note;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));

        // 3. Send
        setTimeout(() => {
          const sendBtn = document.querySelector('button[aria-label="Send now"]');
          if (!sendBtn) return;
          sendBtn.click();

          // 4. Mark done
          fetch('https://YOUR_DEPLOYED_DOMAIN/api/mark-sent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: invite.id })
          });
        }, 1500);
      }, 800);
    }, 800);
  }, 2000);
});
