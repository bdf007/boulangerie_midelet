import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import AboutUploader from "../components/aboutUploader";
// import ColorfulTitle from "../components/getRandomColor";
// import RandomShadow from "../components/getRandomShadowLetter";

const About = () => {
  const { user } = useContext(UserContext);
  const [activeAbout, setActiveAbout] = useState("");

  const getAboutActive = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/activeAbout`)
      .then((response) => {
        setActiveAbout(response.data);
      })
      .catch((error) => {
        console.error(
          "Error fetching active about:",
          error.response || error.message
        );
      });
  };

  useEffect(() => {
    getAboutActive();
  }, []);

  // Fonction pour rafraîchir l'about actif après modification
  const refreshActiveAbout = () => {
    getAboutActive();
  };

  const renderUserContent = () =>
    !activeAbout ? (
      <div>
        <div className="text-center mb-5">
          <h1>Bienvenue sur le site de la boulangerie Midelet</h1>
          <p>La mie des marlysiens</p>
        </div>
        <div className="form-group mb-3">
          <p>
            Ce site est une vitrine pour la boulangerie Midelet, située à
            Marly-Gomont.
            <br />
            Vous y trouverez des informations sur nos produits, nos horaires
            d'ouverture,
            <br />
            ainsi que des informations sur notre histoire et nos valeurs.
            <br />
            <br />
            Nous vous invitons à venir nous rendre visite et à découvrir
          </p>
        </div>
      </div>
    ) : (
      <div>
        <div className="text-center mb-5">
          <h1 style={{ whiteSpace: "pre-wrap" }}>{activeAbout.title}</h1>
        </div>
        <div className="form-group mb-3">
          <img
            src={activeAbout.photo}
            alt={activeAbout.title}
            className="img-fluid"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>

        <div className="form-group mb-3">
          <p dangerouslySetInnerHTML={{ __html: activeAbout.description }}></p>
        </div>
      </div>
    );

  const renderAdminContent = () => (
    <div className="container">
      <AboutUploader onUpdate={refreshActiveAbout} /> {/* Passe la fonction */}
      {renderUserContent()}
    </div>
  );

  return !user || user.role === "user" ? (
    <div className="container mt-5 col-10 col-sm-8 col-md-6 col-lg-5">
      {renderUserContent()}
    </div>
  ) : (
    renderAdminContent()
  );
};

export default About;
