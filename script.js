const form = document.getElementById("checkin-form");
const tableBody = document.querySelector("#student-table tbody");

// Replace this with your Google Apps Script Web App URL:
const SHEET_URL = "https://script.google.com/macros/s/AKfycbxpe4Mq8ID1ylsgPsGyo9mxO-_b0XO0RinA1icq53J8DcwKGFZH5wBnQlFakgtcZo4z/exec";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const subject = document.getElementById("subject").value;
  const level = document.getElementById("level").value;

  const duration = subject === "Both" ? 60 : 30;

  await fetch(SHEET_URL, {
    method: "POST",
    body: JSON.stringify({ name, subject, level, duration }),
    headers: { "Content-Type": "application/json" }
  });

  alert("Check-in recorded!");
  form.reset();
  loadData();
});

async function loadData() {
  const res = await fetch(SHEET_URL);
  const data = await res.json();

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
}

loadData();
