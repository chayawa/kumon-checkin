const SHEET_URL = "https://script.google.com/macros/s/AKfycbx-1T_3cvK-dk4g40qaeJlDl5XTT5TVsQY0yfZydCIM5zVBAE-WEE4UcvyikDahK-pQ/exec";

const form = document.getElementById("checkin-form");
const tableBody = document.querySelector("#student-table tbody");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const subject = document.getElementById("subject").value;
  const level = document.getElementById("level").value;

  const duration = subject === "Both" ? 60 : 30;

  try {
    const response = await fetch(SHEET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, subject, level, duration })
    });

    const result = await response.text();
    console.log("Success:", result);
    alert("Check-in recorded!");
    form.reset();
    loadData();
  } catch (error) {
    console.error("Error:", error);
    alert("There was an error recording the check-in.");
  }
});

async function loadData() {
  try {
    const response = await fetch(SHEET_URL);
    const data = await response.json();

    tableBody.innerHTML = "";

    data.slice(1).forEach((row) => {
      const [name, subject, level, checkInTime, duration] = row;
      const mins = Math.floor((new Date() - new Date(checkInTime)) / 60000);
      const limit = parseInt(duration);
      let status = "🟢 On Time";

      if (mins > limit + 10) status = "🔴 Too Long";
      else if (mins > limit) status = "🟡 Overtime";

      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${name}</td><td>${subject}</td><td>${level}</td><td>${checkInTime}</td><td>${status}</td>`;
      tableBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

loadData();
