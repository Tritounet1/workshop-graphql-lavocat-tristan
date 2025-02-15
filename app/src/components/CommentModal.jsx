import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {useState} from "react";
import PropTypes from "prop-types";

const CommentModal = ({ authorId, projectId, setIsModalOpen }) => {
    const [formData, setFormData] = useState({ text: '' });
    const [error, setError] = useState('');

    const handleNewComment = () => {
        if (!formData.text) {
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
          mutation createComment($author: Int!, $text: String!, $project: Int!) {
            createComment(author: $author, text: $text, project: $project)
          }
        `,
                variables: {
                    author: authorId,
                    text: formData.text,
                    project: projectId,
                },
            })
            .then((result) => {
                console.log(result);
                console.log(result.data);
                if (result) {
                    setIsModalOpen(false);
                    setFormData({ text: '', });
                    window.location.reload();
                } else {
                    alert("Erreur dans la création d'un commentaire.");
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