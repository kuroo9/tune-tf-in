import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/User";
import { SongData } from "../context/Song";
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
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const FormContainer = styled.div`
  background-color: ${props => props.theme.bg};
  color: ${props => props.theme.text};
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid ${props => props.theme.secondary};
  border-radius: 4px;
  background-color: ${props => props.theme.bg};
  color: ${props => props.theme.text};
  font-size: 16px;
  outline: none;
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.text};
  font-size: 16px;
  cursor: pointer;
  outline: none;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LinkText = styled(Link)`
  text-align: center;
  font-size: 14px;
  color: ${props => props.theme.secondary};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loginUser, btnLoading } = UserData();
  const { fetchSongs, fetchAlbums } = SongData();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    loginUser(email, password, navigate, fetchSongs, fetchAlbums);
  };

  return (
    <ThemeProvider theme={darkGreenTheme}>
      <GlobalStyle />
      <Container>
        <FormContainer>
          <motion.h2
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-semibold text-center mb-8"
          >
            Login to Spotify
          </motion.h2>

          <Form onSubmit={submitHandler}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium mb-1">
                Email or username
              </label>
              <Input
                type="email"
                placeholder="Email or Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                disabled={btnLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {btnLoading ? "Please Wait..." : "Login"}
              </Button>
            </motion.div>
          </Form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6"
          >
            <LinkText to="/register">
              Don't have an account?
            </LinkText>
          </motion.div>
        </FormContainer>
      </Container>
    </ThemeProvider>
  );
};

export default Login;