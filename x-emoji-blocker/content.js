console.log('Content script is running');

// List of emojis to filter
const blockedEmojis = ["🏳️‍🌈", "🔞", "🏳️‍⚧️"];

// Recursive function to extract text and emojis from nodes
function extractDisplayName(node) {
  let text = '';

  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      text += child.textContent;
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      if (child.tagName === 'IMG') {
        const altText = child.getAttribute('alt') || '';
        text += altText;
      } else {
        text += extractDisplayName(child);
      }
    }
  });

  return text;
}

// Function to hide tweets from users with blocked emojis
function hideTweets() {
  const tweets = document.querySelectorAll('article');

  tweets.forEach((tweet) => {
    const displayNameContainer = tweet.querySelector('div[data-testid="User-Name"]');

    if (displayNameContainer) {
      const displayName = extractDisplayName(displayNameContainer).trim();
      console.log(`Checking display name: ${displayName}`);

      blockedEmojis.forEach((emoji) => {
        if (displayName.includes(emoji)) {
          console.log(`Hiding tweet from user: ${displayName}`);
          tweet.style.display = 'none';
        }
      });
    } else {
      console.log('Display name container not found in tweet.');
    }
  });
}

// Run the function immediately
hideTweets();

// Observe changes for dynamically loaded content (infinite scroll)
let timeoutId = null;

const observer = new MutationObserver(() => {
  if (timeoutId) clearTimeout(timeoutId);

  timeoutId = setTimeout(() => {
    hideTweets();
  }, 500);
});

observer.observe(document.body, { childList: true, subtree: true });
