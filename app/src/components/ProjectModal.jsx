import {useState} from "react";
import PropTypes from "prop-types";
import {createProject} from "../services/api.js";

const ProjectModal = ({ setIsModalOpen }) => {
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [error, setError] = useState('');

    const handleNewProject = async () => {
        if (!formData.name || !formData.description) {
            setError("Veuillez remplir tous les champs.");
            return;
        }
        setError("");
        try {
            const response = await createProject(formData.name, formData.description);
            if (response.success) {
                console.log("Projet créé avec succès.");
                setIsModalOpen(false);
                setFormData({ name: "", description: "" });
                window.location.reload();
            } else {
                console.error(response.error || "Erreur inconnue lors de la création du projet.");
                alert(response.error || "Erreur inconnue lors de la création du projet.");
            }
        } catch (error) {
            console.error("Erreur inattendue :", error);
            alert("Une erreur inattendue est survenue.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
                <h3 className="text-lg font-semibold mb-4">Créer un Nouveau Projet</h3>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom du projet</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 mt-1 border rounded-lg"
                        placeholder="Nom du projet"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 mt-1 border rounded-lg"
                        placeholder="Description du projet"
                    ></textarea>
                </div>
                <div className="flex justify-end space-x-2">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Annuler</button>
                    <button onClick={handleNewProject} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Confirmer</button>
                </div>
            </div>
        </div>
    )
}

ProjectModal.propTypes = {
    setIsModalOpen: PropTypes.func.isRequired,
};

export default ProjectModal;