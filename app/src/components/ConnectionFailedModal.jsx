import PropTypes from "prop-types";

const ConnectionFailedModal = ({ setShowModal }) => {

    return(
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={() => { setShowModal(false) }}
        >
            <div
                className="bg-white p-8 rounded-lg shadow-md text-center relative"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={"connection-failed.gif"}
                    alt="Error gif"
                    className="mx-auto mb-4"
                />
                <p className="text-lg font-bold text-gray-800 mb-4">Identifiants incorrectes, veuillez réessayer.</p>
                <button
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    onClick={() => { setShowModal(false) }}
                >
                    Fermer
                </button>
            </div>
        </div>
    );
}

ConnectionFailedModal.propTypes = {
    setShowModal: PropTypes.func.isRequired,
};

export default ConnectionFailedModal;