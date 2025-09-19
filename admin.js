const ADMIN_PASSWORD = "Salma123";

function loadTrips() {
  let trips = JSON.parse(localStorage.getItem('cabTrips') || 'null');
  if (!trips) {
    trips = [
      { from: "Mumbai", to: "Pune", date: "2025-09-20", driver: "Amit", seats: 3 },
      { from: "Bangalore", to: "Chennai", date: "2025-09-21", driver: "Salma", seats: 4 }
    ];
    localStorage.setItem('cabTrips', JSON.stringify(trips));
  }
  return trips;
}
function saveTrips(trips) {
  localStorage.setItem('cabTrips', JSON.stringify(trips));
}

document.getElementById('admin-login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const pass = document.getElementById('admin-password').value;
  if (pass === ADMIN_PASSWORD) {
    document.getElementById('admin-lock').style.display = "none";
    document.getElementById('admin-panel').style.display = "block";
    showTrips();
    showBookings();
  } else {
    document.getElementById('admin-error').innerText = "Incorrect password. Try again.";
  }
});

// Add trip modal logic
const addTripModal = document.getElementById('add-trip-modal');
const addTripBtn = document.getElementById('add-trip-btn');
const closeAddTripBtn = document.getElementById('close-add-trip');
addTripBtn.onclick = function() {
  addTripModal.style.display = "block";
  document.getElementById('add-trip-form').reset();
};
closeAddTripBtn.onclick = function() {
  addTripModal.style.display = "none";
};
window.onclick = function(event) {
  if (event.target == addTripModal) {
    addTripModal.style.display = "none";
  }
}

// Add new trip
document.getElementById('add-trip-form').addEventListener('submit', function(e) {
  e.preventDefault();
  let trips = loadTrips();
  const newTrip = {
    from: document.getElementById('add-from').value,
    to: document.getElementById('add-to').value,
    date: document.getElementById('add-date').value,
    driver: document.getElementById('add-driver').value,
    seats: parseInt(document.getElementById('add-seats').value)
  };
  trips.push(newTrip);
  saveTrips(trips);
  addTripModal.style.display = "none";
  showTrips();
});

// Show trips for admin (edit/delete)
function showTrips() {
  const trips = loadTrips();
  const container = document.getElementById('admin-trip-list');
  container.innerHTML = '';
  trips.forEach((trip, i) => {
    const div = document.createElement('div');
    div.className = 'ride-card';
    div.innerHTML = `
      <div><strong>${trip.from}</strong> → <strong>${trip.to}</strong></div>
      <div>Date: <b>${trip.date}</b></div>
      <div>Driver: ${trip.driver}</div>
      <div>Seats Available: ${trip.seats}</div>
      <button class="edit-btn" data-index="${i}">Edit</button>
      <button class="delete-btn" data-index="${i}">Delete</button>
      <div class="edit-form" id="edit-form-${i}" style="display:none;">
        <form>
          <label>From: <input type="text" value="${trip.from}" id="edit-from-${i}" /></label><br>
          <label>To: <input type="text" value="${trip.to}" id="edit-to-${i}" /></label><br>
          <label>Date: <input type="date" value="${trip.date}" id="edit-date-${i}" /></label><br>
          <label>Driver: <input type="text" value="${trip.driver}" id="edit-driver-${i}" /></label><br>
          <label>Seats: <input type="number" min="1" value="${trip.seats}" id="edit-seats-${i}" /></label><br>
          <button type="submit">Save</button>
          <button type="button" class="cancel-btn" data-index="${i}">Cancel</button>
        </form>
      </div>
    `;
    container.appendChild(div);
  });

  // Edit trip
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = btn.getAttribute('data-index');
      document.getElementById(`edit-form-${idx}`).style.display = 'block';
    };
  });

  // Delete trip
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = btn.getAttribute('data-index');
      trips.splice(idx, 1);
      saveTrips(trips);
      showTrips();
    };
  });

  // Cancel edit
  document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = btn.getAttribute('data-index');
      document.getElementById(`edit-form-${idx}`).style.display = 'none';
    };
  });

  // Save edit
  container.querySelectorAll('.edit-form form').forEach((form, i) => {
    form.onsubmit = function(e) {
      e.preventDefault();
      trips[i] = {
        from: document.getElementById(`edit-from-${i}`).value,
        to: document.getElementById(`edit-to-${i}`).value,
        date: document.getElementById(`edit-date-${i}`).value,
        driver: document.getElementById(`edit-driver-${i}`).value,
        seats: parseInt(document.getElementById(`edit-seats-${i}`).value)
      };
      saveTrips(trips);
      showTrips();
    };
  });
}

// Show bookings
function showBookings() {
  const bookings = JSON.parse(localStorage.getItem('cabBookings') || '[]');
  const adminDiv = document.getElementById('admin-bookings');
  if (!bookings.length) {
    adminDiv.innerHTML = "<p>No bookings yet.</p>";
    return;
  }
  adminDiv.innerHTML = '';
  bookings.forEach((b, i) => {
    const div = document.createElement('div');
    div.className = 'ride-card';
    div.innerHTML = `
      <div><strong>${b.trip.from}</strong> → <strong>${b.trip.to}</strong></div>
      <div>Date: <b>${b.trip.date}</b></div>
      <div>Driver: ${b.trip.driver}</div>
      <div>Seats Booked: ${b.seats}</div>
      <div>Name: ${b.name}</div>
      <div>Mobile: ${b.mobile}</div>
      <div>Time: ${b.time}</div>
    `;
    adminDiv.appendChild(div);
  });
}
