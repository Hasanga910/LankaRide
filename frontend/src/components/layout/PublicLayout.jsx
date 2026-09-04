import Navbar from '../Navbar.jsx';
import Footer from '../Footer.jsx';

const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 w-full">{children}</main>
    <Footer />
  </div>
);

export default PublicLayout;
