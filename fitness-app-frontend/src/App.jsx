import './App.css'
import {Box, Button, Typography} from "@mui/material";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "react-oauth2-code-pkce";
import {useDispatch} from "react-redux";
import {setCredentials} from "./store/authSlice.js";
import ActivityForm from "./components/ActivityForm.jsx";
import ActivityList from "./components/ActivityList.jsx";
import ActivityDetail from "./components/ActivityDetail.jsx";

const ActivitiesPage = () => {
    return (<Box component="section" sx={{p: 2, border: '1px dashed grey'}}>
        <ActivityForm onActivitiesAdded={() => window.location.reload()}/>
        <ActivityList/>
    </Box>);
}

function App() {
    const {token, tokenData, logIn, logOut, isAuthenticated} = useContext(AuthContext);
    const dispatch = useDispatch();
    const [auth, setAuthReady] = useState(false)

    useEffect(() => {
        if (token) {
            dispatch(setCredentials({token, user: tokenData}));
            setAuthReady(true);
        }
    }, [token, tokenData, dispatch]);

    useEffect(() => {
        if (tokenData) {
            console.log("[FRONTEND][AUTH]", {
                sub: tokenData.sub,
                email: tokenData.email
            });
        }
    }, [tokenData]);

    return (
        <Router>
            {!token ? (
                <Box
                    sx={{
                        height: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                    }}>
                    <Typography variant="h4" gutterBottom>
                        Welcome to the Fitness Tracker App
                    </Typography>
                    <Typography variant="subtitle1" sx={{mb: 3}}>
                        Please login to access your activities
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => logIn()}>
                        Login
                    </Button>
                </Box>
            ) : (
                <Box component="section" sx={{p: 2, border: '1px dashed grey'}}>
                    <Button variant="contained" color="secondary" onClick={() => logOut()}>
                        Logout
                    </Button>
                    <Routes>
                        <Route path="/activities" element={<ActivitiesPage/>}/>
                        <Route path="/activities/:id" element={<ActivityDetail/>}/>
                        <Route path="/" element={token ? <Navigate to="/activities" replace/> :
                            <div>Welcome! Please Login.</div>}/>
                    </Routes>
                </Box>
            )}
        </Router>
    )
}

export default App
