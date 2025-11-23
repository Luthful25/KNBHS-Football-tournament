document.addEventListener("DOMContentLoaded", () => {

  const players = document.querySelectorAll(".player-card");

  players.forEach(card => {
    const playerName = card.dataset.name;
    const priceInput = card.querySelector(".price-input");
    const teamSelect = card.querySelector(".team-select");
    const saveBtn = card.querySelector(".save-btn");
    const resultBox = card.querySelector(".result");

    // Load previous saved data
    const savedData = JSON.parse(localStorage.getItem("auctionData")) || {};
    if (savedData[playerName]) {
      priceInput.value = savedData[playerName].price;
      teamSelect.value = savedData[playerName].team;

      resultBox.textContent = `Saved: Tk ${savedData[playerName].price} – ${savedData[playerName].team}`;
      resultBox.style.color = "#7efaff";
    }

    // Save Button Event
    saveBtn.addEventListener("click", () => {
      const price = priceInput.value.trim();
      const team = teamSelect.value.trim();

      if (!price || !team) {
        resultBox.textContent = "❗ Price & Team Both Required";
        resultBox.style.color = "#ff4d4d";
        return;
      }

      // Save to LocalStorage
      const data = JSON.parse(localStorage.getItem("auctionData")) || {};
      data[playerName] = { price, team };

      localStorage.setItem("auctionData", JSON.stringify(data));

      // Success Message
      resultBox.textContent = `✔ Saved Successfully: Tk ${price} – ${team}`;
      resultBox.style.color = "#7efaff";

      // Small Glow Animation
      saveBtn.style.boxShadow = "0 0 20px #00eaff";
      setTimeout(() => saveBtn.style.boxShadow = "none", 800);
    });

  });
});

// =========================
// TEAM CLICK → SHOW PLAYERS WITH IMAGE
// =========================

document.querySelectorAll(".team-card").forEach(teamCard => {
  teamCard.addEventListener("click", () => {

    const teamName = teamCard.textContent.trim();
    const savedData = JSON.parse(localStorage.getItem("auctionData")) || {};

    const modal = document.getElementById("teamModal");
    const title = document.getElementById("teamModalTitle");
    const listBox = document.getElementById("teamPlayersList");

    title.textContent = `Players Bought by ${teamName}`;
    listBox.innerHTML = "";

    // Find players bought by this team
    const boughtPlayers = Object.entries(savedData).filter(([player, info]) => {
      return info.team === teamName;
    });

    if (boughtPlayers.length === 0) {
      listBox.innerHTML = "<p>No players bought yet.</p>";
    } else {
      boughtPlayers.forEach(([player, info]) => {
        const div = document.createElement("div");
        div.className = "team-player-item";

        // Get player image from playersGrid
        const playerCard = Array.from(document.querySelectorAll(".player-card"))
          .find(c => c.dataset.name === player);
        let imgSrc = "";
        if (playerCard) {
          imgSrc = playerCard.querySelector("img").src;
        }

        div.innerHTML = `
          <div class="team-player-img-box">
            <img src="${imgSrc}" alt="${player}">
          </div>
          <div class="team-player-info">
            <strong>${player}</strong> – Tk ${info.price}
          </div>
        `;
        listBox.appendChild(div);
      });
    }

    modal.style.display = "flex";
  });
});

// Close modal
document.querySelector(".close-modal").addEventListener("click", () => {
  document.getElementById("teamModal").style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target.id === "teamModal") {
    document.getElementById("teamModal").style.display = "none";
  }
});
