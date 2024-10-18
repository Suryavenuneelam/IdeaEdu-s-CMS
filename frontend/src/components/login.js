import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const defaultTheme = createTheme();

export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleShowPassword = () => {
        setFormData(prevState => ({
            ...prevState,
            showPassword: !prevState.showPassword,
        }));
    };

    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState(''); 

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        try {
            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (response.ok) {
                localStorage.setItem("token", result.token);
                localStorage.setItem("userId", result.userId);
                setSnackbar({
                    open: true,
                    message: 'Login successful!',
                    severity: 'success',
                });
                setTimeout(() => {
                    navigate("/form");
                }, 1000); // Delay navigation to show the success message
            } else {
                setSnackbar({
                    open: true,
                    message: result.error || 'Login failed!',
                    severity: 'error',
                });
            }            
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message,
                severity: 'error',
            });
        } finally {
            // Reset form data after submission
            setFormData({
                email: "",
                password: "",
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Handlers for Forgot Password Dialog
    const handleForgotPasswordClick = () => {
        setForgotPasswordOpen(true);
    };

    const handleForgotPasswordClose = () => {
        setForgotPasswordOpen(false);
    };

    const handleForgotPassword = async () => {
        if (forgotPasswordEmail) {  // Using forgotPasswordEmail instead of formData.email
            try {
                const response = await fetch("http://localhost:5000/auth/forgot-password", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: forgotPasswordEmail, // Use forgotPasswordEmail here
                    }),
                });
    
                if (response.ok) {
                    setSnackbar({
                        open: true,
                        message: 'Password reset link has been sent to your email.',
                        severity: 'success',
                    });
                } else {
                    setSnackbar({
                        open: true,
                        message: 'Failed to send reset link!',
                        severity: 'error',
                    });
                }
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: 'An error occurred while sending reset link!',
                    severity: 'error',
                });
            } finally {
                setForgotPasswordOpen(false);
            }
        } else {
            setSnackbar({
                open: true,
                message: 'Please enter your email!',
                severity: 'warning',
            });
        }
    };
    
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs" sx={{ marginTop: '100px' }}>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Log in
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                            <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type={formData.showPassword ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleShowPassword}
                                                edge="end"
                                            >
                                                {formData.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Log in
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    New Here? Sign up
                                </Link>
                                <br />
                                <Link onClick={handleForgotPasswordClick} variant="body2" style={{ cursor: 'pointer' }}>
                                    Forgot Password?
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>

                {/* Forgot Password Dialog */}
                <Dialog open={forgotPasswordOpen} onClose={handleForgotPasswordClose}>
                    <DialogTitle>Forgot Password</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Please enter your email address. We will send a password reset link to your email.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="forgot-password-email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        value={forgotPasswordEmail} // Bind to forgotPasswordEmail
                        onChange={(e) => setForgotPasswordEmail(e.target.value)} // Handle input change
                    />
                        
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleForgotPasswordClose}>Cancel</Button>
                        <Button onClick={handleForgotPassword}>Send</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
}
