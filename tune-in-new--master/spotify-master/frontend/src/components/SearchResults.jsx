import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { songs, albums } = location.state || { songs: [], albums: [] };

  // Navigate to album details page
  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  // Navigate to song details page
  const handleSongClick = (songId) => {
    navigate(`/song/${songId}`);
  };

  return (
    <div className="p-4 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>

      {/* Songs Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Songs</h2>
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <div
              key={index}
              className="flex items-center mb-4 cursor-pointer"
              onClick={() => handleSongClick(song._id)} // Redirect to song details
            >
              <img
                src={song.thumbnail?.url || "https://via.placeholder.com/50"}
                alt={song.title}
                className="w-12 h-12 object-cover rounded mr-4"
              />
              <div>
                <p className="font-bold">{song.title}</p>
                <p className="text-gray-400">{song.singer}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No songs found.</p>
        )}
      </div>

      {/* Albums Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Albums</h2>
        {albums.length > 0 ? (
          albums.map((album, index) => (
            <div
              key={index}
              className="flex items-center mb-4 cursor-pointer"
              onClick={() => handleAlbumClick(album._id)} // Redirect to album details
            >
              <img
                src={album.thumbnail?.url || "https://via.placeholder.com/50"}
                alt={album.title}
                className="w-12 h-12 object-cover rounded mr-4"
              />
              <div>
                <p className="font-bold">{album.title}</p>
                <p className="text-gray-400">{album.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No albums found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;