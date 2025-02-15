import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {useState} from "react";
import PropTypes from "prop-types";

const TaskModal = ({ projectId, setIsModalOpen }) => {
    const [formData, setFormData] = useState({ title: '' });
    const [error, setError] = useState('');

    const handleNewTask = () => {
        if (!formData.title) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        setError('')

        const client = new ApolloClient({
            uri: 'http://localhost:5050/api',
            cache: new InMemoryCache(),
        });

        client
            .mutate({
                mutation: gql`
          mutation createTask($title: String!, $project: Int!) {
            createTask(title: $title, project: $project)
          }
        `,
                variables: {
                    title: formData.title,
                    project: projectId,
                },
            })
            .then((result) => {
                console.log(result);
                console.log(result.data);
                if (result) {
                    setIsModalOpen(false);
                    setFormData({ title: '', });
                    window.location.reload();
                } else {
                    alert("Erreur dans la création d'une tâche.");
                }
            })
            .catch((err) => {
                console.error('Erreur dans la requête :', err);
                alert('Une erreur est survenue lors de la connexion.');
            });

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