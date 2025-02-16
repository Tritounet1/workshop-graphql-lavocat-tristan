import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register} from "../services/api.js";
import RegisterFailedModal from "../components/RegisterFailedModal.jsx";

export const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.email === '' || formData.password === '') {
      setShowModal(true);
      return;
    }
    register(formData.email, formData.password).then((data) => {
      if(data === true) {
        navigate('/');
      }
      else {
        setShowModal(true);
      }
    });
  };

  return (
    <div className="max-w-md mx-auto mt-48 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Inscription</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          S&apos;inscrire
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Déjà inscrit ?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Connectez-vous
        </Link>
      </p>
      {/* Modal */}
      {showModal && (
          <RegisterFailedModal setShowModal={setShowModal} />
      )}
    </div>
  );
}