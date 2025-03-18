import React, { useState } from "react";
import { UserData } from "../context/User";
import { Link, useNavigate } from "react-router-dom";
import { SongData } from "../context/Song";
import { MdDelete, MdAdd, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";

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
    <div className="p-4 bg-[#121212] text-[#EAEAEA] min-h-screen">
      {/* Navigation */}
      <Link to="/" className="text-[#888888] hover:underline">
        Go to home page
      </Link>

      {/* Add Album Form */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4 text-[#CCCCCC]">Add Album</h2>
        <form onSubmit={addAlbumHandler} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={albumTitle}
            onChange={(e) => setAlbumTitle(e.target.value)}
            required
            className="block w-full p-2 border rounded bg-[#2B2B2B] text-[#EAEAEA] placeholder-[#888]"
          />
          <input
            type="text"
            placeholder="Description"
            value={albumDescription}
            onChange={(e) => setAlbumDescription(e.target.value)}
            required
            className="block w-full p-2 border rounded bg-[#2B2B2B] text-[#EAEAEA] placeholder-[#888]"
          />
          <input
            type="file"
            onChange={(e) => fileChangeHandler(e, setAlbumFile)}
            required
            className="block w-full p-2 border rounded bg-[#2B2B2B] text-[#EAEAEA] placeholder-[#888]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#333333] text-[#EAEAEA] rounded"
          >
            {loading ? "Please Wait..." : "Add Album"}
          </button>
        </form>
      </div>

      {/* Add Song Form */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4 text-[#CCCCCC]">Add Song</h2>
        <form onSubmit={addSongHandler} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            required
            className="block w-full p-2 border rounded bg-[#2B2B2B] text-[#EAEAEA] placeholder-[#888]"
          />
          <input
            type="text"
            placeholder="Description"
            value={songDescription}
            onChange={(e) => setSongDescription(e.target.value)}
            required
            className="block w-full p-2 border rounded bg-[#2B2B2B] text-[#EAEAEA] placeholder-[#888]"
          />
          <input
            type="text"
            placeholder="Singer"
            value={songSinger}
            onChange={(e) => setSongSinger(e.target.value)}
            required
            className="block w-full p-2 border rounded bg-[#2B2B2B] text-[#EAEAEA] placeholder-[#888]"
          />
          <select
            value={songAlbum}
            onChange={(e) => setSongAlbum(e.target.value)}
            required
            className="block w-full p-2 border rounded bg-[#2B2B2B] text-[#EAEAEA] placeholder-[#888]"
          >
            <option value="">Choose Album</option>
            {albums &&
              albums.map((e, i) => (
                <option key={i} value={e._id}>
                  {e.title}
                </option>
              ))}
          </select>
          <input
            type="file"
            onChange={(e) => fileChangeHandler(e, setSongFile)}
            required
            className="block w-full p-2 border rounded bg-[#2B2B2B] text-[#EAEAEA] placeholder-[#888]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#333333] text-[#EAEAEA] rounded"
          >
            {loading ? "Please Wait..." : "Add Song"}
          </button>
        </form>
      </div>

      {/* Display Added Albums */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-[#CCCCCC]">Added Albums</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums &&
            albums.map((e, i) => (
              <div
                key={i}
                className="bg-[#2B2B2B] p-4 rounded-lg flex flex-col items-center space-y-2"
              >
                {e.thumbnail && (
                  <img
                    src={e.thumbnail.url}
                    alt={e.title}
                    className="w-32 h-32 object-cover rounded"
                  />
                )}
                <p className="font-bold text-[#EAEAEA]">{e.title}</p>
                <p className="text-[#888]">{e.description}</p>
                <button
                  onClick={() => deleteAlbumHandler(e._id)}
                  className="px-3 py-1 bg-[#333333] text-[#EAEAEA] rounded"
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Display Added Songs */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-[#CCCCCC]">Added Songs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {songs &&
            songs.map((e, i) => (
              <div
                key={i}
                className="bg-[#2B2B2B] p-4 rounded-lg flex flex-col items-center space-y-2"
              >
                {e.thumbnail ? (
                  <img
                    src={e.thumbnail.url}
                    alt={e.title}
                    className="w-32 h-32 object-cover rounded"
                  />
                ) : (
                  <>
                    <input
                      type="file"
                      onChange={(e) => fileChangeHandler(e, setSongFile)}
                      className="block w-full p-2 border rounded bg-[#2B2B2B] text-[#EAEAEA] placeholder-[#888]"
                    />
                    <button
                      onClick={() => addThumbnailHandler(e._id)}
                      className="px-3 py-1 bg-[#333333] text-[#EAEAEA] rounded"
                    >
                      Add Thumbnail
                    </button>
                  </>
                )}
                <p className="font-bold text-[#EAEAEA]">{e.title}</p>
                <p className="text-[#888]">{e.singer}</p>
                <p className="text-[#888]">{e.description}</p>
                <button
                  onClick={() => deleteSongHandler(e._id)}
                  className="px-3 py-1 bg-[#333333] text-[#EAEAEA] rounded"
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;