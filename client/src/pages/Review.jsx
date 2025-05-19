import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import AllReview from "../components/allReview";
import AdminReviewManagement from "../components/adminReviewManagement";

const Review = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useContext(UserContext);
  const [star, setStar] = useState(0);
  const [userReviewID, setUserReviewID] = useState("");
  const [userReview, setUserReview] = useState([]);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [uploadVisible, setUploadVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(true);

  useEffect(() => {
    if (user) {
      setFirstname(user.firstname);
      setLastname(user.lastname);
      setEmail(user.email);
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/review/email/${user.email}`)
        .then((response) => {
          if (response.data.length > 0) {
            const userReview = response.data[0];
            setMessage(userReview.message);
            setStar(userReview.star);
            setUserReview(userReview);
            setUserReviewID(userReview._id);
          }
        });
    }
  }, [user]);

  const handleStarClick = (starValue) => {
    setStar(starValue === star ? 0 : starValue);
  };

  const handleUpload = (e) => {
    e.preventDefault();

    if (userReviewID) {
      // Si une review existe déjà, on met à jour
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/api/review/update/${userReviewID}`,
          {
            firstname,
            lastname,
            email,
            message,
            star,
            validation: false,
            visible: false,
          }
        )
        .then((response) => {
          toast.success("Review updated successfully");
          setUserReview(response.data); // Mettre à jour l'état de la review
        })
        .catch((error) => {
          toast.error("Failed to update review");
        });
    } else {
      // Sinon, on crée une nouvelle review
      axios
        .post(`${process.env.REACT_APP_API_URL}/api/review`, {
          firstname,
          lastname,
          email,
          message,
          star,
          validation: false,
          visible: false,
        })
        .then((response) => {
          toast.success("Review submitted successfully");
          setUserReview(response.data); // Mettre à jour l'état de la review après création
          setUploadVisible(false);
          setReviewVisible(true);
        })
        .catch((error) => {
          // Check if error response exists
          if (error.response && error.response.data.error) {
            if (
              error.response.data.error ===
              "cet email a déjà été utilisé pour laisser un avis"
            ) {
              setFirstname("");
              setLastname("");
              setEmail("");
              setMessage("");
              setStar(0);
            }
            toast.error(
              "cet email a déjà été utilisé pour laisser un avis, connectez vous ou créez un compte pour modifier votre avis"
            ); // Show specific error message
          } else {
            toast.error("Failed to submit review"); // Generic error message
          }
        });
    }
  };

  const resetMessage = () => {
    // setFirstname("");
    // setLastname("");
    // setEmail("");
    setMessage("");
    setStar(0);
  };

  const handleDelete = () => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/api/review/${userReviewID}`)
      .then(() => {
        toast.success("Review deleted successfully");
        resetMessage();
        setReviewVisible(true);
      })
      .catch((error) => {
        toast.error("Failed to delete review");
      });
  };

  const renderReviewUploader = () => {
    return (
      <div className="container mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-5">
        <h1 className="text-danger">
          {userReview._id ? "Modifier votre review" : "Laisser une review"}
        </h1>
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              className="form-control"
              id="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              className="form-control"
              type="text"
              id="message"
              rows="3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="star">Star Rating</label>
            <div className="star-rating">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  onClick={() => handleStarClick(index + 1)}
                  style={{ cursor: "pointer" }}
                >
                  {index < star ? (
                    <StarIcon sx={{ fontSize: 24, color: "yellow" }} />
                  ) : (
                    <StarOutlineIcon sx={{ fontSize: 24 }} />
                  )}
                </span>
              ))}
            </div>
          </div>
          <br />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              !firstname ||
              !lastname ||
              !email ||
              !emailRegex.test(email) ||
              !message ||
              !star
            }
          >
            {userReview._id ? "Modifier" : "Envoyer"}
          </button>
          {userReview._id && (
            <button className="btn btn-danger" onClick={handleDelete}>
              Supprimer
            </button>
          )}
        </form>
        <p>Votre avis sera publié après vérification par un administrateur</p>
        <p>
          En cas de modification votre avis devra de nouveau être validé par un
          administrateur
        </p>
      </div>
    );
  };

  const toggleReviewUploader = () => {
    setUploadVisible(!uploadVisible);
    setReviewVisible(false);
  };

  const toggleReviewVisible = () => {
    setReviewVisible(!reviewVisible);
    setUploadVisible(false);
  };

  return (
    <div className="home">
      <div className="container mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-5">
        {!uploadVisible && (
          <button className="btn btn-primary" onClick={toggleReviewUploader}>
            {userReview._id ? "Modifiez votre avis" : "Postez votre avis"}
          </button>
        )}
        {!reviewVisible && (
          <button className="btn btn-primary" onClick={toggleReviewVisible}>
            Voir les avis
          </button>
        )}
      </div>
      {userReview._id && !uploadVisible && (
        <div className="container mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-5">
          <p>
            Vous avez déjà laissé un avis , vous pouvez le modifier ou le
            supprimer
          </p>
        </div>
      )}
      {uploadVisible && renderReviewUploader()}
      {user && (user.role === "admin" || user.role === "superadmin") && (
        <div className="container mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-5">
          <h1>Gestion des avis</h1>
          <AdminReviewManagement />
        </div>
      )}

      {(!user || (user.role !== "admin" && user.role !== "superadmin")) &&
        reviewVisible && <AllReview />}
    </div>
  );
};

export default Review;
