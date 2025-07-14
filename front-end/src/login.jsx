import React, { useState } from 'react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Login successful!');
    }, 1500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <div style={styles.header}>
          <h1 style={styles.title}>Codeteam Manager</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>
        
        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {})
              }}
              placeholder="Enter your email"
            />
            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.password ? styles.inputError : {})
              }}
              placeholder="Enter your password"
            />
            {errors.password && <span style={styles.errorText}>{errors.password}</span>}
          </div>
          
          <div style={styles.forgotPassword}>
            <a href="#" style={styles.forgotLink}>Forgot your password?</a>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.submitButton,
              ...(isLoading ? styles.submitButtonDisabled : {})
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
        
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account? <a href="#" style={styles.signupLink}>Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    boxSizing: 'border-box'
  },
  loginCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    padding: '60px',
    width: '100%',
    maxWidth: '500px',
    position: 'relative',
    '@media (min-width: 768px)': {
      maxWidth: '600px',
      padding: '80px'
    }
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 12px 0'
  },
  subtitle: {
    fontSize: '18px',
    color: '#718096',
    margin: '0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px'
  },
  input: {
    padding: '16px 20px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '18px',
    transition: 'all 0.2s ease',
    outline: 'none',
    ':focus': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    }
  },
  inputError: {
    borderColor: '#f56565'
  },
  errorText: {
    fontSize: '12px',
    color: '#f56565',
    marginTop: '4px'
  },
  forgotPassword: {
    textAlign: 'right',
    marginTop: '-10px'
  },
  forgotLink: {
    fontSize: '14px',
    color: '#667eea',
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline'
    }
  },
  submitButton: {
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '18px 24px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '10px',
    ':hover': {
      backgroundColor: '#5a67d8'
    }
  },
  submitButtonDisabled: {
    backgroundColor: '#a0aec0',
    cursor: 'not-allowed'
  },
  footer: {
    textAlign: 'center',
    marginTop: '30px'
  },
  footerText: {
    fontSize: '14px',
    color: '#718096',
    margin: '0'
  },
  signupLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '500',
    ':hover': {
      textDecoration: 'underline'
    }
  }
};

// Add focus styles manually since CSS-in-JS doesn't support pseudo-selectors
const inputFocusStyle = `
  input:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
  }
  
  button:hover:not(:disabled) {
    background-color: #5a67d8 !important;
  }
  
  a:hover {
    text-decoration: underline !important;
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.innerHTML = inputFocusStyle;
document.head.appendChild(styleSheet);

export default LoginPage;