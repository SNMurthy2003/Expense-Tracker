'use client';

import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import SignUpModal from "@/components/SignUpModal";
import { auth } from "@/firebase";
import {
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { darkTheme } from "@/styles/darkTheme";

/* ======== Styled Components ======== */
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${darkTheme.background.primary};
  position: relative;
  overflow: hidden;

  /* Animated background gradients - Purple theme */
  &::before {
    content: '';
    position: fixed;
    top: -50%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(176, 101, 255, 0.12) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    animation: float 20s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: fixed;
    bottom: -30%;
    left: -10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    animation: float 25s ease-in-out infinite reverse;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, -30px) scale(1.05); }
  }
`;

const Card = styled.div`
  display: flex;
  width: 800px;
  max-width: 95%;
  border-radius: ${darkTheme.radius.xl};
  overflow: hidden;
  box-shadow: ${darkTheme.shadow.medium};
  background: ${darkTheme.background.panel};
  border: 1px solid ${darkTheme.border.light};
  position: relative;
  z-index: 1;
  backdrop-filter: blur(16px);
  animation: slideIn 0.6s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

/* Left panel */
const LeftPanel = styled.div`
  flex: 1;
  background: ${darkTheme.brand.gradient};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${darkTheme.text.primary};
  padding: 40px 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: rotate 30s linear infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const WalletImage = styled.img`
  width: 90px;
  margin-bottom: 25px;
  filter: drop-shadow(0 4px 12px rgba(176, 101, 255, 0.4));
  position: relative;
  z-index: 1;
  animation: pulse 3s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const AppTitle = styled.h1`
  font-size: 1.9rem;
  font-weight: 700;
  text-align: center;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

/* Right panel */
const RightPanel = styled.div`
  flex: 1;
  background: ${darkTheme.background.panel};
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h2`
  font-size: 1.6rem;
  color: ${darkTheme.text.primary};
  margin-bottom: 25px;
  font-weight: 700;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid ${darkTheme.border.medium};
  border-radius: ${darkTheme.radius.md};
  font-size: 1rem;
  background: ${darkTheme.background.glass};
  color: ${darkTheme.text.primary};
  transition: all 0.3s ease;

  &::placeholder {
    color: ${darkTheme.text.secondary};
  }

  &:focus {
    border-color: ${darkTheme.brand.primary};
    outline: none;
    box-shadow: 0 0 0 3px rgba(176, 101, 255, 0.2);
    background: rgba(255, 255, 255, 0.06);
  }

  &:hover {
    border-color: ${darkTheme.border.light};
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 12px;
  background: ${darkTheme.brand.gradient};
  color: ${darkTheme.text.primary};
  border: none;
  border-radius: ${darkTheme.radius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;
  box-shadow: ${darkTheme.shadow.glow};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(176, 101, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

/* ✨ Beautiful modern Google button */
const GoogleButton = styled.button`
  width: 100%;
  margin-top: 18px;
  padding: 12px 16px;
  border: 1.5px solid ${darkTheme.border.medium};
  border-radius: ${darkTheme.radius.md};
  background: ${darkTheme.background.glass};
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 500;
  color: ${darkTheme.text.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${darkTheme.shadow.soft};

  &:hover {
    background: ${darkTheme.background.glassHover};
    border-color: ${darkTheme.brand.primary};
    box-shadow: 0 4px 12px rgba(176, 101, 255, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 0.9rem;
  color: ${darkTheme.text.secondary};

  a {
    color: ${darkTheme.brand.primary};
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      color: ${darkTheme.brand.primaryHover};
      text-shadow: 0 0 8px rgba(176, 101, 255, 0.4);
    }
  }
`;

const SmallLink = styled.p`
  text-align: center;
  font-size: 0.85rem;
  color: ${darkTheme.text.secondary};
  margin-top: 10px;

  a {
    color: ${darkTheme.brand.primary};
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      color: ${darkTheme.brand.primaryHover};
    }
  }
`;

/* ======== Component ======== */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // Email/Password Login with Unified Authentication
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    try {
      // Check what sign-in methods exist for this email
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      // Case 1: Account exists only with Google Sign-In
      if (signInMethods.includes('google.com') && !signInMethods.includes('password')) {
        alert('This account is linked with Google Sign-In. Please use the "Continue with Google" button to log in.');
        return;
      }

      // Case 2: Normal email/password login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user in localStorage for session persistence
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));

      console.log("✅ Login successful");
      router.push("/dashboard");
    } catch (error) {
      console.error('Login error:', error);

      // User-friendly error messages
      if (error.code === 'auth/user-not-found') {
        alert('No account found with this email. Please sign up first.');
      } else if (error.code === 'auth/wrong-password') {
        alert('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        alert('Invalid email format.');
      } else if (error.code === 'auth/too-many-requests') {
        alert('Too many failed login attempts. Please try again later.');
      } else if (error.code === 'auth/invalid-credential') {
        alert('Invalid email or password. Please try again.');
      } else {
        alert(`Login failed: ${error.message}`);
      }
    }
  };

  // Google Sign-In
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store user in localStorage for session persistence
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));

      console.log("✅ Google login successful");
      router.push("/dashboard");
    } catch (error) {
      console.error('Google sign-in error:', error);

      if (error.code === 'auth/popup-closed-by-user') {
        alert('Google Sign-In was cancelled.');
      } else if (error.code === 'auth/popup-blocked') {
        alert('Please allow popups for this website to use Google Sign-In.');
      } else {
        alert(`Google Sign-In failed: ${error.message}`);
      }
    }
  };

  // Handle Sign Up (callback from SignUpModal)
  const handleSignUp = async (userData) => {
    // SignUpModal now handles Firebase signup directly
    // This callback is just for post-signup actions
    console.log('User signed up:', userData);
  };

  return (
    <LoginContainer>
      <Card>
        {/* Left Side */}
        <LeftPanel>
          <WalletImage
            src="https://cdn-icons-png.flaticon.com/512/3081/3081878.png"
            alt="Wallet Icon"
          />
          <AppTitle>Expense Tracker</AppTitle>
        </LeftPanel>

        {/* Right Side */}
        <RightPanel>
          <form onSubmit={handleSubmit}>
            <Title>Log In</Title>

            <InputGroup>
              <Input
                type="text"
                placeholder="Email or Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>

            <InputGroup>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>

            <LoginButton type="submit">Log In</LoginButton>

            <GoogleButton type="button" onClick={handleGoogleLogin}>
              <FcGoogle />
              Continue with Google
            </GoogleButton>

            <LinkText>
              Don&apos;t have an account?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowSignUpModal(true);
                }}
              >
                Sign Up
              </a>
            </LinkText>
            <SmallLink>
              <a href="/forgot-password">Forgot password?</a>
            </SmallLink>
          </form>
        </RightPanel>
      </Card>

      {/* Sign Up Modal */}
      <SignUpModal
        show={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSignUp={handleSignUp}
      />
    </LoginContainer>
  );
}
