import Card from '../components/ui/Card.jsx';
import Alert from '../components/ui/Alert.jsx';

const AboutPage = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
    <div className="max-w-2xl mb-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800">About LankaRide</h1>
      <p className="mt-2 text-gray-500">Why we built role-based bus management for Sri Lanka.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <div className="h-10 w-10 rounded-lg bg-danger-bg text-danger flex items-center justify-center mb-4">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-navy-800">The Problem</h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          Public transport is the primary way most Sri Lankans travel, but day-to-day bus operations are
          still almost entirely manual — conductors track seat availability by eye, passengers have no way
          of knowing how full a bus is before they reach the stop, and there is no simple digital record of
          which driver or conductor is assigned to a vehicle.
        </p>
      </Card>

      <Card>
        <div className="h-10 w-10 rounded-lg bg-success-bg text-success flex items-center justify-center mb-4">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-navy-800">Our Solution</h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          LankaRide gives Admins, Drivers, Conductors and Passengers each their own dashboard: the Admin
          onboards staff, Drivers register buses and update trip status, Conductors manually keep the
          free-seat count accurate as passengers board and alight, and Passengers see live seat availability
          and trip status before they travel.
        </p>
      </Card>
    </div>

    <Alert variant="info" className="mt-6">
      Note: this is a hackathon prototype using sample seeded data — seat counts reflect the conductor's
      manual updates, not automated or sensor-based counting, and are not connected to an official transport
      authority.
    </Alert>
  </div>
);

export default AboutPage;
