import React, { useState } from "react";
import { UserData } from "../context/User";
import { Link, useNavigate } from "react-router-dom";
import { SongData } from "../context/Song";
import { MdDelete, MdAdd, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import styled, { keyframes } from "styled-components";

// Glow Animation
const glow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
  }
`;

// Styled Components
const Container = styled.div`
  padding: 1rem;
  background: #121212;
  color: #eaeaea;
  min-height: 100vh;
`;

const FormContainer = styled.div`
  background: #1a1a1a;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.75rem;
  border: 1px solid #333;
  border-radius: 6px;
  background: #2b2b2b;
  color: #eaeaea;
  font-size: 0.875rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #00ff00;
    box-shadow: 0 0 8px rgba(0, 255, 0, 0.3);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.75rem;
  border: 1px solid #333;
  border-radius: 6px;
  background: #2b2b2b;
  color: #eaeaea;
  font-size: 0.875rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #00ff00;
    box-shadow: 0 0 8px rgba(0, 255, 0, 0.3);
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: #333;
  color: #eaeaea;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background: #444;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Card = styled.div`
  background: #1a1a1a;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 0.5rem;
`;

const CardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: bold;
  color: #eaeaea;
  margin-bottom: 0.25rem;
`;

const CardText = styled.p`
  font-size: 0.75rem;
  color: #888;
  margin-bottom: 0.5rem;
`;

const Admin = () => {
  const { user } = UserData();
  const {
    albums,
    songs,
    addAlbum,
    loading,
    addSong,
    addThumbnail,
    deleteSong,
    deleteAlbum,
  } = SongData();
  const navigate = useNavigate();

  // Redirect non-admin users
  if (user && user.role !== "admin") {
    navigate("/");
    return null;
  }

  // Separate states for album and song forms
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [albumFile, setAlbumFile] = useState(null);

  const [songTitle, setSongTitle] = useState("");
  const [songDescription, setSongDescription] = useState("");
  const [songSinger, setSongSinger] = useState("");
  const [songAlbum, setSongAlbum] = useState("");
  const [songFile, setSongFile] = useState(null);

  const fileChangeHandler = (e, setState) => {
    const file = e.target.files[0];
    setState(file);
  };

  const addAlbumHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", albumTitle);
    formData.append("description", albumDescription);
    formData.append("file", albumFile);

    try {
      await addAlbum(formData, setAlbumTitle, setAlbumDescription, setAlbumFile);
      toast.success("Album added successfully!");
    } catch (error) {
      toast.error("Failed to add album.");
    }
  };

  const addSongHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", songTitle);
    formData.append("description", songDescription);
    formData.append("singer", songSinger);
    formData.append("album", songAlbum);
    formData.append("file", songFile);

    try {
      await addSong(
        formData,
        setSongTitle,
        setSongDescription,
        setSongFile,
        setSongSinger,
        setSongAlbum
      );
      toast.success("Song added successfully!");
    } catch (error) {
      toast.error("Failed to add song.");
    }
  };

  const addThumbnailHandler = async (id) => {
    const formData = new FormData();
    formData.append("file", songFile);

    try {
      await addThumbnail(id, formData, setSongFile);
      toast.success("Thumbnail added successfully!");
    } catch (error) {
      toast.error("Failed to add thumbnail.");
    }
  };

  const deleteSongHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      deleteSong(id);
      toast.success("Song deleted successfully!");
    }
  };

  const deleteAlbumHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this album?")) {
      deleteAlbum(id);
      toast.success("Album deleted successfully!");
    }
  };

  return (
    <Container>
      {/* Navigation */}
      <Link to="/" className="text-[#888888] hover:underline">
        Go to home page
      </Link>

      {/* Add Album Form */}
      <FormContainer>
        <h2 className="text-lg font-bold mb-2 text-[#CCCCCC]">Add Album</h2>
        <form onSubmit={addAlbumHandler} className="space-y-2">
          <Input
            type="text"
            placeholder="Title"
            value={albumTitle}
            onChange={(e) => setAlbumTitle(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Description"
            value={albumDescription}
            onChange={(e) => setAlbumDescription(e.target.value)}
            required
          />
          <Input
            type="file"
            onChange={(e) => fileChangeHandler(e, setAlbumFile)}
            required
          />
          <Button type="submit">
            {loading ? "Please Wait..." : "Add Album"}
          </Button>
        </form>
      </FormContainer>

      {/* Add Song Form */}
      <FormContainer>
        <h2 className="text-lg font-bold mb-2 text-[#CCCCCC]">Add Song</h2>
        <form onSubmit={addSongHandler} className="space-y-2">
          <Input
            type="text"
            placeholder="Title"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Description"
            value={songDescription}
            onChange={(e) => setSongDescription(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Singer"
            value={songSinger}
            onChange={(e) => setSongSinger(e.target.value)}
            required
          />
          <Select
            value={songAlbum}
            onChange={(e) => setSongAlbum(e.target.value)}
            required
          >
            <option value="">Choose Album</option>
            {albums &&
              albums.map((e, i) => (
                <option key={i} value={e._id}>
                  {e.title}
                </option>
              ))}
          </Select>
          <Input
            type="file"
            onChange={(e) => fileChangeHandler(e, setSongFile)}
            required
          />
          <Button type="submit">
            {loading ? "Please Wait..." : "Add Song"}
          </Button>
        </form>
      </FormContainer>

      {/* Display Added Albums */}
      <div className="mt-4">
        <h2 className="text-lg font-bold mb-2 text-[#CCCCCC]">Added Albums</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {albums &&
            albums.map((e, i) => (
              <Card key={i}>
                {e.thumbnail && (
                  <CardImage src={e.thumbnail.url} alt={e.title} />
                )}
                <CardTitle>{e.title}</CardTitle>
                <CardText>{e.description}</CardText>
                <Button onClick={() => deleteAlbumHandler(e._id)}>
                  Delete
                </Button>
              </Card>
            ))}
        </div>
      </div>

      {/* Display Added Songs */}
      <div className="mt-4">
        <h2 className="text-lg font-bold mb-2 text-[#CCCCCC]">Added Songs</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {songs &&
            songs.map((e, i) => (
              <Card key={i}>
                {e.thumbnail ? (
                  <CardImage src={e.thumbnail.url} alt={e.title} />
                ) : (
                  <>
                    <Input
                      type="file"
                      onChange={(e) => fileChangeHandler(e, setSongFile)}
                    />
                    <Button onClick={() => addThumbnailHandler(e._id)}>
                      Add Thumbnail
                    </Button>
                  </>
                )}
                <CardTitle>{e.title}</CardTitle>
                <CardText>{e.singer}</CardText>
                <CardText>{e.description}</CardText>
                <Button onClick={() => deleteSongHandler(e._id)}>Delete</Button>
              </Card>
            ))}
        </div>
      </div>
    </Container>
  );
};

export default Admin;