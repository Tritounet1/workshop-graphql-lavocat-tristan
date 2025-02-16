import {useState} from "react";
import PropTypes from "prop-types";
import {createTask} from "../services/api.js";

const TaskModal = ({ projectId, setIsModalOpen }) => {
    const [formData, setFormData] = useState({ title: '' });
    const [error, setError] = useState('');

    const handleNewTask = async () => {
        if (!formData.title) {
            setError("Veuillez remplir tous les champs.");
            return;
        }
        setError("");
        try {
            const response = await createTask(formData.title, projectId);
            if (response.success) {
                setIsModalOpen(false);
                setFormData({ title: "" });
                window.location.reload();
            } else {
                console.error(response.error || "Erreur inconnue lors de la création de la tâche.");
                alert(response.error || "Erreur inconnue lors de la création de la tâche.");
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
                <h3 className="text-lg font-semibold mb-4">Créer une nouvelle Tâche</h3>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom de la tâche</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 mt-1 border rounded-lg"
                        placeholder="Nom de la Tâche"
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Annuler</button>
                    <button onClick={handleNewTask} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Confirmer</button>
                </div>
            </div>
        </div>
    )
}

TaskModal.propTypes = {
    projectId: PropTypes.number,
    setIsModalOpen: PropTypes.func.isRequired,
};

export default TaskModal;