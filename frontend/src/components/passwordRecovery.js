import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';

const defaultTheme = createTheme();

export default function PasswordRecovery() {
    const [newPassword, setNewPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showRetypePassword, setShowRetypePassword] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });
    const [passwordError, setPasswordError] = useState('');
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "newPassword") {
            setNewPassword(value);
            // Reset password error when user types
            setPasswordError('');
        } else if (name === "retypePassword") {
            setRetypePassword(value);
        }
    };

    const handleToggleNewPasswordVisibility = () => {
        setShowNewPassword((prev) => !prev);
    };

    const handleToggleRetypePasswordVisibility = () => {
        setShowRetypePassword((prev) => !prev);
    };

    const passwordPolicy = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return (
            password.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumber &&
            hasSpecialChar
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); 

        if (!passwordPolicy(newPassword)) {
            setPasswordError('Password must be at least 8 characters long, include upper and lower case letters, a number, and a special character.');
            return;
        }

        if (newPassword !== retypePassword) {
            setSnackbar({
                open: true,
                message: 'Passwords do not match!',
                severity: 'error',
            });
            return;
        }

        // Extract the token from the URL
        const token = window.location.pathname.split('/')[2];
        try {
            const response = await fetch(`http://localhost:5000/auth/reset-password/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password: newPassword }),
            });

            if (response.ok) {
                setSnackbar({
                    open: true,
                    message: 'Password has been reset successfully!',
                    severity: 'success',
                });

                // Reset fields after submission
                setNewPassword('');
                setRetypePassword('');
            } else {
                const data = await response.json();
                setSnackbar({
                    open: true,
                    message: data.message || 'Failed to reset password!',
                    severity: 'error',
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'An error occurred while resetting password!',
                severity: 'error',
            });
        }
    };
    
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
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
                        Password Recovery
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="newPassword"
                                    label="New Password"
                                    type={showNewPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={handleInputChange}
                                    error={!!passwordError}
                                    helperText={passwordError}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button onClick={handleToggleNewPasswordVisibility}>
                                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                </Button>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="retypePassword"
                                    label="Retype Password"
                                    type={showRetypePassword ? 'text' : 'password'}
                                    id="retypePassword"
                                    value={retypePassword}
                                    onChange={handleInputChange}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button onClick={handleToggleRetypePasswordVisibility}>
                                                    {showRetypePassword ? <VisibilityOff /> : <Visibility />}
                                                </Button>
                                            </InputAdornment>
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
                            Reset Password
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/signin" variant="body2">
                                    Remembered your password? Log in
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
            </Container>
        </ThemeProvider>
    );
}
