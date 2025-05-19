import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import StarIcon from "@mui/icons-material/Star";

const AdminReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [averageStars, setAverageStars] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/review`)
      .then((response) => {
        setReviews(response.data.reviews);

        const validatedReviews = response.data.reviews.filter(
          (review) => review.validation === true
        );
        const average =
          validatedReviews.reduce((acc, review) => acc + review.star, 0) /
          validatedReviews.length;
        setAverageStars(average || 0);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, []);

  const handleValidatedChange = (id, value) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/api/review/validation/${id}`, {
        validation: value,
      })
      .then(() => {
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review._id === id ? { ...review, validation: value } : review
          )
        );
        toast.success("Review validation updated");
      })
      .catch((error) => {
        console.error("Error updating validation:", error);
        toast.error("Failed to update review validation");
      });
  };

  const handleVisibleChange = (id, value) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/api/review/visibility/${id}`, {
        visible: value,
      })
      .then(() => {
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review._id === id ? { ...review, visible: value } : review
          )
        );
        toast.success("Review visibility updated");
      })
      .catch((error) => {
        console.error("Error updating visibility:", error);
        toast.error("Failed to update review visibility");
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/api/review/${id}`)
      .then(() => {
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review._id !== id)
        );
        toast.success("Review deleted");
      });
  };

  return (
    <div className="container">
      <h3>
        Moyenne d'étoiles:{" "}
        {averageStars ? `${averageStars}/5` : "Aucune review validée"}
      </h3>

      {reviews.map((review) => (
        <div key={review._id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Prénom: {review.firstname}</h5>
            <h5 className="card-title">Nom: {review.lastname}</h5>
            <p className="card-text">Email: {review.email}</p>
            <pre className="card-text">Avis: {review.message}</pre>
            <p className="card-text">
              <StarIcon sx={{ fontSize: 24, color: "yellow" }} />: {review.star}
            </p>
            <p className="card-text">
              Date: {new Date(review.date).toLocaleString()}
            </p>

            <div className="form-check">
              <label
                className="form-check-label"
                htmlFor={`validated-${review._id}`}
              >
                Validé: {review.validation ? "Yes" : "No"}
              </label>
              <input
                type="checkbox"
                className="form-check-input"
                id={`validated-${review._id}`}
                checked={review.validation}
                onChange={() =>
                  handleValidatedChange(review._id, !review.validation)
                }
              />
            </div>

            <div className="form-check">
              <label
                className="form-check-label"
                htmlFor={`visible-${review._id}`}
              >
                Visible: {review.visible ? "Yes" : "No"}
              </label>
              <input
                type="checkbox"
                className="form-check-input"
                id={`visible-${review._id}`}
                checked={review.visible}
                onChange={() =>
                  handleVisibleChange(review._id, !review.visible)
                }
              />
            </div>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(review._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminReviewManagement;
