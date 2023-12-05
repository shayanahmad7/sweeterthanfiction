document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.heart-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const songId = e.target.dataset.songId;
        const action = e.target.classList.contains('added') ? '/remove-from-wishlist' : '/add-to-wishlist';
  
        try {
          const response = await fetch(action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ songId })
          });
  
          if (response.ok) {
            e.target.classList.toggle('added');
            e.target.textContent = e.target.classList.contains('added') ? '❤️' : '🤍';
          } else {
            console.error("Failed to toggle wishlist status");
          }
        } catch (error) {
          console.error("Error in fetch:", error);
        }
      });
    });
  });
  