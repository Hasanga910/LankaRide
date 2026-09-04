const AboutPage = () => (
  <div className="container">
    <h2>The Problem</h2>
    <p>
      Public transport is the primary way most Sri Lankans travel, but day-to-day bus operations are
      still almost entirely manual — conductors track seat availability by eye, passengers have no way
      of knowing how full a bus is before they reach the stop, and there is no simple digital record of
      which driver or conductor is assigned to a vehicle.
    </p>
    <h2>Our Solution</h2>
    <p>
      BusBuddy LK gives Admins, Drivers, Conductors and Passengers each their own dashboard: the Admin
      onboards staff, Drivers register buses and update trip status, Conductors manually keep the
      free-seat count accurate as passengers board and alight, and Passengers see live seat availability
      and trip status before they travel.
    </p>
    <p className="muted">
      Note: this is a hackathon prototype using sample seeded data — seat counts reflect the conductor's
      manual updates, not automated or sensor-based counting, and are not connected to an official
      transport authority.
    </p>
  </div>
);

export default AboutPage;
