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

function displayTrips(tripsArr) {
  const tripList = document.getElementById('trip-list');
  tripList.innerHTML = '';
  if (!tripsArr.length) {
    tripList.innerHTML = '<p>No trips available right now.</p>';
    return;
  }
  tripsArr.forEach((trip, i) => {
    const div = document.createElement('div');
    div.className = 'ride-card';
    div.innerHTML = `
      <div><strong>${trip.from}</strong> → <strong>${trip.to}</strong></div>
      <div>Date: <b>${trip.date}</b></div>
      <div>Driver: ${trip.driver}</div>
      <div>Seats Available: ${trip.seats}</div>
      <button class="book-btn" data-index="${i}">Book Now</button>
    `;
    tripList.appendChild(div);
  });
  document.querySelectorAll('.book-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      openBookingModal(btn.getAttribute('data-index'));
    });
  });
}

const modal = document.getElementById('booking-modal');
const closeModalBtn = document.getElementById('close-modal');
closeModalBtn.onclick = function() {
  modal.style.display = "none";
  document.getElementById('booking-form').style.display = "block";
  document.getElementById('booking-confirmation').style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.getElementById('booking-form').style.display = "block";
    document.getElementById('booking-confirmation').style.display = "none";
  }
}

function openBookingModal(tripIndex) {
  modal.style.display = "block";
  document.getElementById('book-trip-index').value = tripIndex;
  document.getElementById('booking-form').reset();
  document.getElementById('booking-form').style.display = "block";
  document.getElementById('booking-confirmation').style.display = "none";
}

document.getElementById('booking-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const trips = loadTrips();
  const index = parseInt(document.getElementById('book-trip-index').value);
  const name = document.getElementById('user-name').value;
  const mobile = document.getElementById('user-mobile').value;
  const seats = parseInt(document.getElementById('user-seats').value);
  if (seats < 1 || seats > trips[index].seats) {
    alert("Invalid seat number. Seats available: " + trips[index].seats);
    return;
  }
  const booking = {
    trip: trips[index],
    name,
    mobile,
    seats,
    time: new Date().toLocaleString()
  };
  let bookings = JSON.parse(localStorage.getItem('cabBookings') || '[]');
  bookings.push(booking);
  localStorage.setItem('cabBookings', JSON.stringify(bookings));
  trips[index].seats -= seats;
  saveTrips(trips);
  document.getElementById('booking-form').style.display = "none";
  document.getElementById('booking-confirmation').style.display = "block";
  document.getElementById('booking-confirmation').innerHTML =
    `<b>Booking Confirmed!</b><br>Your ride from <strong>${booking.trip.from}</strong> to <strong>${booking.trip.to}</strong> on <b>${booking.trip.date}</b>.<br>
    Name: ${name}, Mobile: ${mobile}<br>Seats Booked: ${seats}<br>Thank you!`;
  displayTrips([trips[index]]);
});

displayTrips(loadTrips());
