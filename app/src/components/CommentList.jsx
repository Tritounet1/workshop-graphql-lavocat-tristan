import PropTypes from "prop-types";
import {Trash} from "lucide-react";
import {deleteComment} from "../services/api.js";

export const CommentList = ({ userRole, comments }) => {
  if (!comments || !comments.length) {
    return <p className="text-center text-gray-500 italic">Aucun commentaire pour le moment.</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="group bg-white/60 backdrop-blur-sm rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-200/50 hover:border-indigo-200/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
              {comment.author.email[0].toUpperCase()}
            </div>
            <div className="text-sm font-medium text-gray-600">{comment.author.email}</div>
          </div>
          <div className="text-gray-800 pl-10">{comment.text}</div>
          {(userRole === "ADMIN" && (
              <div>
                <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteComment(comment.id).then((r) => {
                        if (!r.success) {
                          console.log(r.error);
                        }
                      });
                    }}
                >
                  <Trash />
                </button>
              </div>
          ))}
        </div>
      ))}
    </div>
  );
}

CommentList.propTypes = {
  userRole: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
};
