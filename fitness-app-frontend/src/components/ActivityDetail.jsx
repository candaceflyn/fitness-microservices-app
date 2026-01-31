import React, {useEffect, useState} from 'react'
import {useParams} from "react-router";
import {getActivityDetail, getActivityRecommendation} from "../services/api.js";
import {Box, Card, CardContent, Divider, Typography} from "@mui/material";

const ActivityDetail = () => {
    const {id} = useParams();
    const [activity, setActivity] = useState(null);
    const [recommendation, setRecommendation] = useState(null);

    useEffect(() => {
        const fetchActivityDetail = async () => {
            try{
                const response = await getActivityDetail(id);
                setActivity(response.data);
                console.log("DETAIL ACTIVITY RESPONSE:", response.data);

            } catch (error){
                console.error(error);
            }
        }
        fetchActivityDetail();
    }, [id]);

    useEffect(() => {
    const fetchActivityRecommendation = async () => {
        try{
            const response = await getActivityRecommendation(id);
            setRecommendation(response.data);
            console.log("DETAIL RECOMMENDATION RESPONSE:", response.data);
        } catch (error){
            console.error(error);
        }
    }
        fetchActivityRecommendation();
    }, [id]);

    if(!activity){
        return <Typography>Loading...</Typography>;
    }
    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Activity Details</Typography>
                    <Typography>Type: {activity.activityType}</Typography>
                    <Typography>Duration: {activity.duration} minutes</Typography>
                    <Typography>Calories Burned: {activity.caloriesBurned}</Typography>
                    <Typography>Date: {new Date(activity.createdAt).toLocaleString()}</Typography>
                </CardContent>
            </Card>

            {recommendation && (
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>AI Recommendation</Typography>
                        <Typography variant="h6">Analysis</Typography>
                        <Typography paragraph>{recommendation.recommendation}</Typography>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6">Improvements</Typography>
                        {recommendation.improvements?.map((item, index) => (
                            <Typography key={index}>• {item}</Typography>
                        ))}

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6">Suggestions</Typography>
                        {recommendation.suggestions?.map((item, index) => (
                            <Typography key={index}>• {item}</Typography>
                        ))}

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6">Safety Guidelines</Typography>
                        {recommendation.safety?.map((item, index) => (
                            <Typography key={index}>• {item}</Typography>
                        ))}
                    </CardContent>
                </Card>
            )}
        </Box>
    )
}

export default ActivityDetail