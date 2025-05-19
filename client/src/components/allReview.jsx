import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const AllReview = () => {
  const [reviews, setReviews] = useState([]);

  const getReviews = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/review/visible`
      );
      setReviews(res.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  return (
    <div
      className="container mt-5 col-10 col-sm-8 col-md-6 col-lg-5"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "16px",
      }}
    >
      {reviews.map((review) => (
        <div className="col">
          <div className="card" key={review._id}>
            <div className="card-body text-center mb-5">
              <Typography variant="h6" className="card-title">
                {review.firstname}
              </Typography>
              <Typography variant="h5" className="card-text">
                <blockquote style={{ fontStyle: "italic" }}>
                  "{review.message}"
                </blockquote>
              </Typography>

              <div className="star-rating">
                {[...Array(5)].map((_, index) => (
                  <React.Fragment key={index}>
                    {index < review.star ? (
                      <StarIcon sx={{ color: "yellow", fontSize: 24 }} />
                    ) : (
                      <StarBorderIcon sx={{ color: "inherit", fontSize: 24 }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllReview;
