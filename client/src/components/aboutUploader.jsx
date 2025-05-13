import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import MyTextEditor from "./myTextEditor";

const AboutUploader = ({ onUpdate }) => {
  // Récupère la prop onUpdate
  const [listOfAbouts, setListOfAbouts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [activeAbout, setActiveAbout] = useState(false);
  const [editingAboutId, setEditingAboutId] = useState(null);
  const [visibleUpload, setVisibleUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const { user } = useContext(UserContext);

  const getAbouts = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/abouts`)
      .then((response) => {
        setListOfAbouts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching about:", error);
        setListOfAbouts([]);
      });
  };

  const renderAbouts = () => {
    return (
      <div className="row">
        {listOfAbouts.map((about) => (
          <div className="col-md-6 col-lg-4 mb-4" key={about._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5
                  className="card-title"
                  dangerouslySetInnerHTML={{ __html: about.title }}
                ></h5>
                <p
                  className="card-text"
                  dangerouslySetInnerHTML={{ __html: about.description }}
                ></p>
                <p>
                  actif:{" "}
                  <span style={{ color: about.activeAbout ? "blue" : "red" }}>
                    {about.activeAbout.toString() === "true" ? "oui" : "non"}
                  </span>
                </p>
                <br />
                <img
                  src={about.photo}
                  alt={about.title}
                  className="img-fluid"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <br />
                <button
                  className="btn btn-primary"
                  onClick={() => loadAboutForEditing(about)}
                >
                  Mettre à jour
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteAbout(about._id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const loadAboutForEditing = (about) => {
    setTitle(about.title);
    setDescription(about.description);
    setPhoto(about.photo);
    setActiveAbout(about.activeAbout);
    setEditingAboutId(about._id);
    setVisibleUpload(true);
  };

  const updateAbout = async (id) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/api/about/update/${id}`,
        {
          title,
          description,
          photo,
          activeAbout,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        }
      )
      .then(() => {
        toast.success("About updated");
        setEditingAboutId(null);
        getAbouts();
        resetForm();
        if (onUpdate) onUpdate(); // Appelle la fonction onUpdate après la mise à jour
      })
      .catch((error) => {
        console.error("Error updating about:", error);
        toast.error("Failed to update about");
      });
  };

  const createAbout = async (e) => {
    // e.preventDefault();
    try {
      const fileReader = new FileReader();

      const base64Data = await new Promise((resolve, reject) => {
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.onerror = reject;
        fileReader.readAsDataURL(selectedFile);
      });

      const imageAbout = new Image();
      imageAbout.src = base64Data;

      await new Promise((resolve, reject) => {
        imageAbout.onload = () => resolve();
        imageAbout.onerror = reject;
      });

      // set the maximum width and height for the image
      const maxWidth = 800;
      const maxHeight = 600;

      let newWidth = imageAbout.width;
      let newHeight = imageAbout.height;

      // resize the image while maintaining the aspect ratio
      if (imageAbout.width > maxWidth) {
        newWidth = maxWidth;
        newHeight = Math.floor(
          (imageAbout.height * maxWidth) / imageAbout.width
        );
      }
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = Math.floor(
          (imageAbout.width * maxHeight) / imageAbout.height
        );
      }

      // create a canvas element to draw the resized image
      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(imageAbout, 0, 0, newWidth, newHeight);
      // convert the canvas content to base64 with WebP format
      const resizedBase64Data = canvas.toDataURL("image/webp");

      const aboutData = {
        title,
        description,
        photo: resizedBase64Data,
        activeAbout,
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/about/create`,
        aboutData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        }
      );
      if (res.data.error) {
        toast.error(res.data.error);
      } else {
        toast.success("About created");
        getAbouts();
        resetForm();
        if (onUpdate) onUpdate(); // Appelle la fonction onUpdate après la création
      }
    } catch (error) {
      console.error("Error creating about:", error);
      toast.error("Failed to create about");
    }
  };

  const deleteAbout = async (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/api/about/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        withCredentials: true,
      })
      .then(() => {
        toast.success("About deleted");
        getAbouts();
        resetForm();
        if (onUpdate) onUpdate(); // Appelle la fonction onUpdate après la suppression
      })
      .catch((error) => {
        console.error("Error deleting about:", error);
        toast.error("Failed to delete about");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingAboutId) {
      updateAbout(editingAboutId);
    } else {
      createAbout();
    }
  };
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPhoto("");
    setActiveAbout(false);
    setEditingAboutId(null);
    setVisibleUpload(false);
  };

  useEffect(() => {
    getAbouts();
  }, []);

  return (
    user &&
    (user.role === "admin" || user.role === "superadmin") && (
      <div className="container-fluid mt-5">
        <h1>About uploader</h1>
        {!editingAboutId && (
          <button
            className="btn btn-primary"
            onClick={() => setVisibleUpload(!visibleUpload)}
          >
            {visibleUpload ? "Masquer" : "Afficher"} l'uploader
          </button>
        )}
        {visibleUpload && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <textarea
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <label htmlFor="description">Description</label>
              <MyTextEditor text={description} setText={setDescription} />

              <label htmlFor="photo">Photo</label>
              <input
                type="file"
                id="file"
                accept="image/*"
                className="form-control"
                placeholer="photo"
                onChange={handleFileInputChange}
                // ref={fileInputRef} // Ajout de la référence
              />

              <label htmlFor="activeAbout">Active About</label>
              <input
                type="checkbox"
                className="form-control-checkbox"
                id="activeAbout"
                checked={activeAbout}
                onChange={(e) => setActiveAbout(e.target.checked)}
              />
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary">
                {editingAboutId ? "Mettre à jour" : "créer"}
              </button>
              {editingAboutId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        )}
        {!visibleUpload && (
          <>
            <h3>Liste des "à propos" disponibles</h3>
            <div className="row">
              {listOfAbouts.length === 0 ? (
                <p>
                  Pas d'à propos disponible, utiliser le formulaire ci-desous
                  pour en créer un
                </p>
              ) : (
                renderAbouts()
              )}
            </div>
          </>
        )}
      </div>
    )
  );
};

export default AboutUploader;
