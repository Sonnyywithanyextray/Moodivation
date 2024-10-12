import React, { useState, CSSProperties, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logo1.png';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [registrationMessage, setRegistrationMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setRegistrationMessage('Registration successful! Please log in.');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: any) {
      console.error('Registration Error:', error.message);
      setRegistrationMessage(`Registration failed: ${error.message}`);
    }
  };

  const logoSize = windowWidth < 768 ? '150px' : windowWidth < 1024 ? '175px' : '200px';

  const styles: { [key: string]: CSSProperties } = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: 'black',
      fontFamily: '"Source Sans Pro", sans-serif',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
    },
    formContainer: {
      width: '100%',
      maxWidth: '1200px',
      display: 'flex',
      flexDirection: windowWidth < 768 ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: windowWidth < 768 ? '20px' : '40px',
      backgroundColor: '#111',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      boxSizing: 'border-box',
    },
    leftSection: {
      flex: windowWidth < 768 ? 'none' : '1',
      marginRight: windowWidth < 768 ? '0' : '40px',
      marginBottom: windowWidth < 768 ? '20px' : '0',
      width: windowWidth < 768 ? '100%' : 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    logoContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-start',
      marginBottom: '20px',
      paddingLeft: '20px',
    },
    logo: {
      width: logoSize,
      height: logoSize,
      objectFit: 'cover',
      borderRadius: '50%',
    },
    rightSection: {
      flex: windowWidth < 768 ? 'none' : '1',
      width: '100%',
    },
    title: {
      color: 'white',
      fontSize: windowWidth < 768 ? '24px' : '36px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    subtitle: {
      color: 'white',
      fontSize: windowWidth < 768 ? '16px' : '18px',
      marginBottom: '20px',
    },
    form: {
      width: '100%',
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '15px',
      backgroundColor: '#333',
      border: 'none',
      borderRadius: '6px',
      color: 'white',
      fontSize: '16px',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#4caf50',
      color: 'black',
      border: 'none',
      borderRadius: '6px',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    loginLink: {
      color: '#4caf50',
      textDecoration: 'none',
      fontSize: '14px',
      display: 'block',
      textAlign: 'center',
      marginTop: '15px',
    },
    message: {
      color: 'white',
      textAlign: 'center',
      marginTop: '15px',
      fontSize: '16px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.leftSection}>
          <div style={styles.logoContainer}>
            <img src={logo} alt="MoodiFi Logo" style={styles.logo} />
          </div>
          <h1 style={styles.title}>Join MoodiFi</h1>
          <p style={styles.subtitle}>
            Start your journey to better mental well-being today.
          </p>
        </div>
        <div style={styles.rightSection}>
          <form onSubmit={handleRegister} style={styles.form}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Password (6+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Register
            </button>
          </form>
          {registrationMessage && (
            <p style={styles.message}>{registrationMessage}</p>
          )}
          <Link to="/" style={styles.loginLink}>
            Already have an account? Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;