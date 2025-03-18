import React from "react";
import Layout from "../components/Layout";
import { SongData } from "../context/Song";
import AlbumItem from "../components/AlbumItem";
import SongItem from "../components/SongItem";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { motion } from "framer-motion";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${props => props.theme.bg};
    color: ${props => props.theme.text};
    transition: background-color 0.3s, color 0.3s;
  }
`;

const darkGreenTheme = {
  bg: "#000",
  text: "#fff",
  primary: "#28a745",
  secondary: "#228B22",
};

const Container = styled.div`
  padding: 24px;
`;

const SectionTitle = styled(motion.h1)`
  font-size: 24px;
  font-weight: bold;
  margin: 24px 0 16px;
  text-align: center;
`;

const ItemList = styled(motion.div)`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0 16px;
`;

// Default images for fallback
const DEFAULT_ALBUM_IMAGE = "https://via.placeholder.com/150";
const DEFAULT_SONG_IMAGE = "https://via.placeholder.com/150";

const Home = () => {
  const { songs, albums } = SongData();

  return (
    <ThemeProvider theme={darkGreenTheme}>
      <GlobalStyle />
      <Layout>
        <Container>
          {/* Featured Charts Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SectionTitle
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Featured Charts
            </SectionTitle>
            <ItemList
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {albums.length > 0 ? (
                albums.map((album, i) => {
                  const imageUrl = album?.thumbnail?.url || DEFAULT_ALBUM_IMAGE;
                  return (
                    <AlbumItem
                      key={i}
                      image={imageUrl}
                      name={album.title || "Unknown Album"}
                      desc={album.description || "No description available"}
                      id={album._id || `album-${i}`}
                    />
                  );
                })
              ) : (
                <p>No albums available</p>
              )}
            </ItemList>
          </motion.div>

          {/* Today's Biggest Hits Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SectionTitle
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Today's Biggest Hits
            </SectionTitle>
            <ItemList
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {songs.length > 0 ? (
                songs.map((song, i) => {
                  const imageUrl = song?.thumbnail?.url || DEFAULT_SONG_IMAGE;
                  return (
                    <SongItem
                      key={i}
                      image={imageUrl}
                      name={song.title || "Unknown Song"}
                      desc={song.description || "No description available"}
                      id={song._id || `song-${i}`}
                    />
                  );
                })
              ) : (
                <p>No songs available</p>
              )}
            </ItemList>
          </motion.div>
        </Container>
      </Layout>
    </ThemeProvider>
  );
};

export default Home;