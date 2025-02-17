import {useState} from "react";
import PropTypes from "prop-types";
import {createComment} from "../services/api.js";

const CommentModal = ({ projectId, setIsModalOpen }) => {
    const [formData, setFormData] = useState({ text: '' });
    const [error, setError] = useState('');

    const handleNewComment = async () => {
        if (!formData.text) {
            setError("Veuillez remplir tous les champs.");
            return;
        }

        setError("");

        try {
            const response = await createComment(formData.text, projectId);

            if (response.success) {
                console.log("Commentaire créé avec succès.");
                setIsModalOpen(false);
                setFormData({ text: "" });
            } else {
                console.error(response.error || "Erreur inconnue lors de la création du commentaire.");
                alert(response.error || "Erreur inconnue lors de la création du commentaire.");
            }
        } catch (err) {
            console.error("Erreur non gérée :", err);
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
                <h3 className="text-lg font-semibold mb-4">Créer un nouveau Commentaire</h3>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Contenu du commentaire </label>
                    <input
                        type="text"
                        id="text"
                        name="text"
                        value={formData.text}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 mt-1 border rounded-lg"
                        placeholder="Contenu du commentaire"
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Annuler</button>
                    <button onClick={handleNewComment} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Confirmer</button>
                </div>
            </div>
        </div>
    )
}

CommentModal.propTypes = {
    authorId: PropTypes.number,
    projectId: PropTypes.number,
    setIsModalOpen: PropTypes.func.isRequired,
};

export default CommentModal;